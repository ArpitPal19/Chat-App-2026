import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    const userData = newUser.toObject();
    delete userData.password;

    res.json({
      success: true,
      userData,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const userData = await User.findOne({ email });

    // User doesn't exist
    if (!userData) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(userData._id);

    const safeUserData = userData.toObject();
    delete safeUserData.password;

    res.json({
      success: true,
      userData: safeUserData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check authentication
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          fullName,
        },
        {
          new: true,
        },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        {
          new: true,
        },
      );
    }

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
