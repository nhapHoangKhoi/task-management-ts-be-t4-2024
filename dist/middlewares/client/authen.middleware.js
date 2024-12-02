"use strict";
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
exports.checkAuthen = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const checkAuthen = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const checkToken = request.headers.authorization;
    if (!checkToken) {
        response.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token!"
        });
        return;
    }
    const theToken = checkToken.split(" ")[1];
    if (!theToken) {
        response.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token!"
        });
        return;
    }
    const accountUser = yield user_model_1.default.findOne({
        token: theToken,
        deleted: false
    });
    if (!accountUser) {
        response.json({
            code: 403,
            message: "Token không hợp lệ!"
        });
        return;
    }
    request["tokenVerified"] = theToken;
    request["accountUser"] = accountUser;
    next();
});
exports.checkAuthen = checkAuthen;
