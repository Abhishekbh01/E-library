import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["admin", "member"],
        default: "user"
    },
    borrowedBooks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' ,
        default: []
    }],
    profile: {
        bio:{type: String},
        profilePhoto:{
            type: String,
            default: ''
        }
    }
},{timestamps: true})

export const User = mongoose.model('User', userSchema);