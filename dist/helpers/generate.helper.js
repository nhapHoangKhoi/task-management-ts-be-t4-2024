"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateToken = void 0;
const generateToken = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token = token + characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};
exports.generateToken = generateToken;
const generateRandomNumber = (length) => {
    const characters = "0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token = token + characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};
exports.generateRandomNumber = generateRandomNumber;
