import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";
import bcryptjs from "bcryptjs";
import { uploader } from "../../utils/cloudinaryConfig.js";
import { dataUri } from "../../utils/multer.js";

// @desc    Get all users with pagination and filtering
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      username: { $regex: search, $options: "i" },
    };

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error fetching users"));
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error fetching user"));
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, phoneNumber, isVendor, isUser, isAdmin } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    user.username = username || user.username;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    
    if (isVendor !== undefined) user.isVendor = isVendor === 'true' || isVendor === true;
    if (isUser !== undefined) user.isUser = isUser === 'true' || isUser === true;
    if (isAdmin !== undefined) user.isAdmin = isAdmin === 'true' || isAdmin === true;

    // Handle image upload
    if (req.files && req.files.length > 0) {
      const fileDataUri = dataUri(req);
      if (fileDataUri && fileDataUri.length > 0) {
        const result = await uploader.upload(fileDataUri[0].data, {
          public_id: fileDataUri[0].filename,
        });
        user.profilePicture = result.secure_url;
      }
    }

    const updatedUser = await user.save();
    
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error updating user"));
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error deleting user"));
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { username, email, phoneNumber, isVendor, isUser, isAdmin, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return next(errorHandler(400, "User already exists with this email or username"));

    const hashedPassword = bcryptjs.hashSync(password || "RentARide@123", 10);
    
    let profilePicture = undefined;
    if (req.files && req.files.length > 0) {
      const fileDataUri = dataUri(req);
      if (fileDataUri && fileDataUri.length > 0) {
        const result = await uploader.upload(fileDataUri[0].data, {
          public_id: fileDataUri[0].filename,
        });
        profilePicture = result.secure_url;
      }
    }

    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      isVendor: isVendor === 'true' || isVendor === true,
      isUser: isUser === 'true' || isUser === true,
      isAdmin: isAdmin === 'true' || isAdmin === true,
      ...(profilePicture && { profilePicture })
    });

    await newUser.save();
    
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).json({ message: "User created successfully", user: rest });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error creating user"));
  }
};
