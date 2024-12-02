export const generateToken = (length: number): string =>
{
   const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   let token: string = "";

   for(let i: number = 0; i < length; i++) {
      token = token + characters.charAt(Math.floor(Math.random() * characters.length));
   }

   return token;
}

export const generateRandomNumber = (length: number): string =>
{
   const characters: string = "0123456789";

   let token: string = "";

   for(let i: number = 0; i < length; i++) {
      token = token + characters.charAt(Math.floor(Math.random() * characters.length));
   }

   return token;
}