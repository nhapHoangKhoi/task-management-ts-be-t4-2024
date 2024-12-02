import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";

export const checkAuthen = async (request: Request, response: Response, next: NextFunction) =>
{
   const checkToken: string = request.headers.authorization;

   if(!checkToken) {
      response.json(
         {
            code: 400,
            message: "Vui lòng gửi kèm theo token!"
         }
      );
      return;
   }

   const theToken: string = checkToken.split(" ")[1];

   if(!theToken) {
      response.json(
         {
            code: 400,
            message: "Vui lòng gửi kèm theo token!"
         }
      );
      return;
   }


   const accountUser = await UserModel.findOne(
      {
         token: theToken,
         deleted: false
      }
   );

   if(!accountUser) {
      response.json(
         {
            code: 403, // 403 : ko co quyen truy cap
            message: "Token không hợp lệ!"
         }
      );
      return;
   }

   request["tokenVerified"] = theToken; // any javascript file goes through this line can use it
   request["accountUser"] = accountUser;

   next();
}