import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
   
    username: String,
    email: String,
    message: String
   
});
export default mongoose.model('contact', userSchema);