import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      fullName: String,
      email: String,
      // link Facebook: ...
      password: String,
      token: String, // api - client side rendering, khoi can viet tokenUser
      deleted: {
         type: Boolean,
         default: false
      },
   },
   {
      timestamps: true // automatically insert field createdAt, updatedAt
   }
);

const UserModel = mongoose.model("User", userSchema, "users");

export default UserModel;