import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import crypto from "crypto";
import Otp from "../models/Otp.js";
import User from "../models/User.js";

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send OTP Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate OTP (6 digits)
  const otp = crypto.randomInt(100000, 999999).toString();

  // OTP expiration (10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

  // Check if an OTP already exists for this email and delete it if so
  await Otp.deleteMany({ email });

  // Save OTP in the database
  const otpRecord = new Otp({
    email,
    otp,
    expiresAt,
  });

  try {
    await otpRecord.save();

    const msg = {
      to: email, // Recipient email
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Your OTP for Email Verification",
      html: `
        <html>
          <body>
            <h1>OTP for Email Verification</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>It will expire in 10 minutes.</p>
          </body>
        </html>
      `,
    };

    // Send OTP Email using SendGrid
    await sgMail.send(msg);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    // Fetch the latest OTP record for the given email
    const record = await Otp.findOne({ email }).sort({ expiresAt: -1 });

    if (!record) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    // Check if the OTP has expired
    if (record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Check if the OTP matches
    if (record.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // Mark the user as verified (assuming there is a field `isVerified` in the User model)
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // Clean up OTP records after verification
    await Otp.deleteMany({ email });

    return res
      .status(200)
      .json({ message: "OTP verified and user marked as verified." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};
