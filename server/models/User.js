import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
    },
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },
    verificationToken:{
        type: String,
    },
    resetPasswordToken:{
        type: String,
    },
    resetPasswordExpire:{
        type: Date,
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

const User = mongoose.model("User",UserSchema);

export default User;