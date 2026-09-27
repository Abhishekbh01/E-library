import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/getDataUri.js";

export const register = async (req, res) => {
    try {
        const { fullname, phoneNumber, email, password, role } = req.body;
        if(!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
        if(role !== 'admin' && role !== 'member'){
            return res.status(400).json({
                message: "Invalid role",
                success: false
            })
        }
        let user = await User.findOne({email: email});
        if(user) {
            res.status(400).json({
                message: "Email already exists",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            fullname,
            phoneNumber,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.status(201).json({
            message: "User registered successfully",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Failed to register user",
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password or email",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(403).json({
                message: "You are not authorized to access this resource",
                success: false
            });
        }

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            borrowedBooks: user.borrowedBooks,
            profile: user.profile
        };

        // Cookie options for cross-origin authentication
        const cookieOptions = {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'strict' to 'lax' for cross-site cookies
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost'
        };

        // Send response with token cookie
        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login",
            success: false
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to logout",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {fullname, email, phoneNumber, bio} = req.body;
        const userId = req.id;
        let profilePhoto;
        
        // Handle profile photo upload if present
        if (req.files && req.files.profilePhoto) {
            try {
                const profilePhotoFile = req.files.profilePhoto[0];
                const fileUri = getDataUri(profilePhotoFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content).then(response => response.secure_url);
                profilePhoto = cloudResponse;
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({
                    message: "Error uploading profile photo: " + error.message,
                    success: false
                });
            }
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        if(fullname) user.fullname = fullname;
        if(email)user.email = email;
        if(phoneNumber)user.phoneNumber = phoneNumber;
        if(bio)user.profile.bio = bio;
        if(profilePhoto) user.profile.profilePhoto = profilePhoto;

        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            profile: user.profile,
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update profile",
            success: false
        });
    }
}

export const numberOfBorrowedBooks  = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        const count = user.borrowedBooks.length;
        if(count === 0){
            return res.status(200).json({
                message: "No borrowed books found",
                count: 0,
                success: true
            })
        }
        return res.status(200).json({
            message: "Number of borrowed books",
            count,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to get number of borrowed books",
            success: false
        })
    }
}

export const addBorrowedBook = async (req, res) => {
    try {
        const userId = req.id; // from auth middleware
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required",
                success: false
            });
        }

        // Check if the book is already borrowed by the user
        const user = await User.findById(userId);
        if (user.borrowedBooks.includes(bookId)) {
            return res.status(400).json({
                message: "Book already borrowed",
                success: false
            });
        }

        // Add the book to borrowedBooks array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { borrowedBooks: bookId } },
            { new: true }
        )
        .populate('borrowedBooks');

        return res.status(200).json({
            message: "Book added to your library",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error("Error adding borrowed book:", error);
        return res.status(500).json({
            message: "Failed to add book to library",
            success: false,
            error: error.message
        });
    }
}