"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.loginAccount = exports.registerAccount = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const md5_1 = __importDefault(require("md5"));
const generateHelper = __importStar(require("../../helpers/generate.helper"));
const sendEmailHelper = __importStar(require("../../helpers/sendEmail.helper"));
const registerAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const existedUser = yield user_model_1.default.findOne({
        email: request.body.email,
        deleted: false
    });
    if (existedUser) {
        response.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
        return;
    }
    const userRegisterData = {
        fullName: request.body.fullName,
        email: request.body.email,
        password: (0, md5_1.default)(request.body.password),
        token: generateHelper.generateToken(30)
    };
    const newUserModel = new user_model_1.default(userRegisterData);
    yield newUserModel.save();
    response.json({
        code: 200,
        message: "Đăng ký tài khoản thành công!",
        token: userRegisterData.token
    });
});
exports.registerAccount = registerAccount;
const loginAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const inputEmail = request.body.email;
    const inputPassword = request.body.password;
    const theAccount = yield user_model_1.default.findOne({
        email: inputEmail,
        deleted: false
    });
    if (!theAccount) {
        response.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }
    if ((0, md5_1.default)(inputPassword) != theAccount.password) {
        response.json({
            code: 400,
            message: "Email hoặc mật khẩu không đúng!"
        });
        return;
    }
    response.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: theAccount.token
    });
});
exports.loginAccount = loginAccount;
const forgotPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const inputEmail = request.body.email;
    const existedUser = yield user_model_1.default.findOne({
        email: inputEmail,
        deleted: false
    });
    if (!existedUser) {
        response.json({
            code: 400,
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }
    const expireAfter = 3 * 60 * 1000;
    const otp = generateHelper.generateRandomNumber(6);
    const duplicatedForgotEmail = yield forgot_password_model_1.default.findOne({
        email: inputEmail
    });
    if (duplicatedForgotEmail) {
        yield forgot_password_model_1.default.deleteMany({
            email: inputEmail
        });
    }
    const forgotPasswordData = {
        email: inputEmail,
        otp: otp,
        expireAt: Date.now() + expireAfter
    };
    const newForgotPasswordModel = new forgot_password_model_1.default(forgotPasswordData);
    yield newForgotPasswordModel.save();
    const subject = "OTP - Reset password";
    const content = `Mã OTP xác thực của bạn là: <b style="color: red;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác`;
    sendEmailHelper.sendEmail(inputEmail, subject, content);
    response.json({
        code: 200,
        message: "Đã gửi mã OTP qua email!"
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.body.email;
    const otp = request.body.otp;
    const comparedData = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!comparedData) {
        response.json({
            code: 400,
            message: "OTP không hợp lệ!"
        });
        return;
    }
    const theUser = yield user_model_1.default.findOne({
        email: email
    });
    response.json({
        code: 200,
        message: "Xác thực thành công!",
        token: theUser.token
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = request.body.password;
    const tokenUser = request.body.token;
    yield user_model_1.default.updateOne({
        token: tokenUser,
        deleted: false
    }, {
        password: (0, md5_1.default)(newPassword)
    });
    response.json({
        code: 200,
        message: "Đổi mật khẩu thành công!"
    });
});
exports.resetPassword = resetPassword;
const getProfile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request["tokenVerified"];
        const theUser = yield user_model_1.default.findOne({
            token: token,
            deleted: false
        }).select("-password -token");
        response.json({
            code: 200,
            message: "Thành công!",
            user: theUser
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.getProfile = getProfile;
