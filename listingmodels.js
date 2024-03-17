import { Int32 } from "mongodb";
import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
   email:String,
   productname:String,
   productaddress:String,
   productdescription:String,
   price:Number,
   rating:Number,
   productimage:
   {
       data: Buffer,
       contentType: String
   }
   
});
export default mongoose.model('list', userSchema);