import SystemSettings from "../../models/SystemSettingsModel.js";
import { errorHandler } from "../../utils/error.js";

// Get current settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SystemSettings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    next(errorHandler(500, "Error fetching settings"));
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const { razorpayKeyId, razorpaySecret } = req.body;
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({ razorpayKeyId, razorpaySecret });
    } else {
      settings.razorpayKeyId = razorpayKeyId;
      settings.razorpaySecret = razorpaySecret;
      await settings.save();
    }
    
    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    next(errorHandler(500, "Error updating settings"));
  }
};
