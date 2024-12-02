import { Request, Response } from "express";
import UserModel from "../../models/task.model";

// const ForgotPasswordModel = require("../../models/forgot-password.model.js");

import md5 from "md5";
import * as generateHelper from "../../helpers/generate.helper";
// const sendEmailHelper = require("../../helpers/sendEmail.helper.js");

// ----------------[]------------------- //
// [POST] /user/register
export const registerAccount = async (request: Request, response: Response) => 
{
   // ----- Check existed email ----- //
   const existedUser = await UserModel.findOne(
      {
         email: request.body.email,
         deleted: false
      }
   );

   if(existedUser) {
      response.json(
         {
            code: 400,
            message: "Email đã tồn tại!"
         }
      );

      return; // stop the program immediatly
   }
   // ----- End check existed email ----- //

   
   const userRegisterData = {
      fullName: request.body.fullName,
      email: request.body.email,
      password: md5(request.body.password), // encrypt password
      token: generateHelper.generateToken(30) // generate random token
   };


   // ----- Store that user data into database ----- //
   const newUserModel = new UserModel(userRegisterData);
   await newUserModel.save();
   // ----- End store that user data into database ----- //
   

   response.json(
      {
         code: 200,
         message: "Đăng ký tài khoản thành công!",
         token: userRegisterData.token // return token to "store" "token" in the cookie of the user
      }
   );
}
// ----------------End []------------------- //


// // ----------------[]------------------- //
// // [POST] /user/login
// module.exports.loginAccount = async (request, response) =>
// {
//    const inputEmail = request.body.email;
//    const inputPassword = request.body.password;

//    const theAccount = await UserModel.findOne(
//       {
//          email: inputEmail,
//          deleted: false
//       }
//    );

//    if(!theAccount) {
//       response.json(
//          {
//             code: 400,
//             message: "Email không tồn tại!"
//          }
//       );
//       return; // stop the program immediately
//    }

//    if(md5(inputPassword) != theAccount.password) {
//       response.json(
//          {
//             code: 400,
//             message: "Email hoặc mật khẩu không đúng!"
//          }
//       );
//       return; // stop the program immediately
//    }

//    response.json(
//       {
//          code: 200,
//          message: "Đăng nhập thành công!",
//          token: theAccount.token
//       }
//    );
// }
// // ----------------End []------------------- //


// // ----------------[]------------------- //
// // [POST] /user/password/forgot
// module.exports.forgotPassword = async (request, response) =>
// {
//    const inputEmail = request.body.email;

//    // ----- Check existed email ----- //
//    const existedUser = await UserModel.findOne(
//       {
//          email: inputEmail,
//          deleted: false
//       }
//    );

//    if(!existedUser) {
//       response.json(
//          {
//             code: 400,
//             message: "Email không tồn tại trong hệ thống!"
//          }
//       );
//       return;
//    }
//    // ----- End check existed email ----- //


//    // ----- Buoc 1 : Store email, OTP into database ----- //
//    const expireAfter = 3 * 60 * 1000; // 3 minutes (in miliseconds)
//    const otp = generateHelper.generateRandomNumber(6);

//    const duplicatedForgotEmail = await ForgotPasswordModel.findOne(
//       {
//          email: inputEmail
//       }
//    );
   
//    if(duplicatedForgotEmail) {
//       await ForgotPasswordModel.deleteMany(
//          {
//             email: inputEmail
//          }
//       );
//    }
   
//    const forgotPasswordData = {
//       email: inputEmail,
//       otp: otp,
//       expireAt: Date.now() + expireAfter
//    };
   
//    const newForgotPasswordModel = new ForgotPasswordModel(forgotPasswordData);
//    await newForgotPasswordModel.save();
//    // ----- End buoc 1 : Store email, OTP into database ----- //


//    // ----- Buoc 2 : Automatically send OTP through user's email ----- //
//    const subject = "OTP - Reset password";
//    const content = `Mã OTP xác thực của bạn là: <b style="color: red;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác`;

//    sendEmailHelper.sendEmail(inputEmail, subject, content);
//    // ----- End buoc 2 : Automatically send OTP through user's email ----- //


//    // ----- Buoc 3 : Navigate to "type_in_OTP" page ----- // 
//    // ko lam FE nen ko can cai nay nua
//    // response.redirect(`/user/password/otp?email=${inputEmail}`);
//    // ko lam FE nen ko can cai nay nua
//    // ----- End buoc 3 : Navigate to "type_in_OTP" page ----- // 


//    response.json(
//       {
//          code: 200,
//          message: "Đã gửi mã OTP qua email!"
//       }
//    );
// }

// // [POST] /user/password/otp
// module.exports.otpPassword = async (request, response) => 
// {
//    const email = request.body.email;
//    const otp = request.body.otp;

//    const comparedData = await ForgotPasswordModel.findOne(
//       {
//          email: email,
//          otp: otp
//       }
//    );

//    if(!comparedData) {
//       response.json(
//          {
//             code: 400,
//             message: "OTP không hợp lệ!"
//          }
//       );
//       return;
//    }

//    // ----- Return "token" "in the cookie" of the user ----- //
//    const theUser = await UserModel.findOne(
//       {
//          email: email
//       }
//    );
//    // ----- End return "token" "in the cookie" of the user ----- //


//    response.json(
//       {
//          code: 200,
//          message: "Xác thực thành công!",
//          token: theUser.token
//       }
//    );
// }

// // [PATCH] /user/password/reset
// module.exports.resetPassword = async (request, response) => 
// {
//    const newPassword = request.body.password;
//    const tokenUser = request.body.token; // line nay khac voi khi code server-side-rendering

//    await UserModel.updateOne(
//       {
//          token: tokenUser,
//          deleted: false
//       },
//       {
//          password: md5(newPassword)
//       }
//    );

//    response.json(
//       {
//          code: 200,
//          message: "Đổi mật khẩu thành công!"
//       }
//    );
// }
// // ----------------End []------------------- //


// // ----------------[]------------------- //
// // [GET] /user/profile
// module.exports.getProfile = async (request, response) => 
// {
//    try {
//       const token = request.tokenVerified;

//       const theUser = await UserModel.findOne(
//          {
//             token: token,
//             deleted: false
//          }
//       ).select("-password -token");

//       response.json(
//          {
//             code: 200,
//             message: "Thành công!",
//             user: theUser
//          }
//       );
//    }
//    catch(error) {
//       response.json(
//          {
//             code: 404,
//             message: "Not Found"
//          }
//       );
//    }
// }
// // ----------------End []------------------- //