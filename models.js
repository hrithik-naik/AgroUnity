import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    gstin: String,
    username: String,
    email: String,
    password: String
   
});
export default mongoose.model('User', userSchema);