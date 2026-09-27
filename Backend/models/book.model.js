import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    bookPrice: {
        type: Number,
        required: true
    },
    borrowedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    author:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    isbn:{
        type: String,
        unique: true
    },
    coverUrl:{
        type: String,
    },
    description: {
        type: String
    },
    bookUrl: {
        type: String
    }
},{timestamps: true})

export const Book = mongoose.model("Book", bookSchema)