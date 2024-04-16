import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    buyeremail:String,
    selleremail:String,
    productid:String,
    productname:String,
    price:Number,
    rating:Number,
  });
  export default mongoose.model('buy', userSchema);