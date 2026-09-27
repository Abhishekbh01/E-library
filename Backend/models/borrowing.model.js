import mongoose from "mongoose";

const borrowingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    accessType: {
        type: String,
        enum: ["Buy", "Subscribe"],
        required: true
    },
    accessExpiry: {
        type: Date,
        default: null
    }
},{timestamps: true})

export const Borrowing = mongoose.model("Borrowing",  borrowingSchema);