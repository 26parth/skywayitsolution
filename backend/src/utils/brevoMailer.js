// backend/src/utils/brevoMailer.js
import axios from "axios";
import fs from "fs";
import path from "path";

export const sendCertificateEmail = async (toEmail, toName, filePath) => {
  try {
    // 1. File system se certificate read karke Base64 me badlo
    const fileBuffer = await fs.promises.readFile(filePath);
    const content = fileBuffer.toString("base64");
    const filename = path.basename(filePath);

    // 2. Brevo API request
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to: [{ email: toEmail, name: toName }],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "Skyway IT Solution",
        },
        subject: "🎓 Your Certificate",
        htmlContent: `
          <p>Hi ${toName},</p>
          <p>Please find your certificate attached.</p>
          <p>Regards,<br/>Skyway IT Solution</p>
        `,
        attachment: [
          {
            content: content,
            name: filename,
            type: "application/pdf" // ✅ Mandatory for Brevo attachments
          },
        ],
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Best Practice: File send hone ke baad server se delete karo taaki space na bhare
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error("Failed to delete temp file:", err.message);
    }

    return response.data;
  } catch (error) {
    console.error(
      "BREVO ERROR FULL:",
      error?.response?.data || error.message
    );
    throw error;
  }
};


export const sendForgotPasswordEmail = async (toEmail, toName, resetUrl) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to: [{ email: toEmail, name: toName }],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "Skyway IT Solution",
        },
        subject: "🔒 Reset Your Password - Skyway IT Solution",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hi ${toName},</p>
            <p>Humne suna hai ki aap apna password bhool gaye hain. Koi baat nahi, niche di gayi link par click karke aap apna password reset kar sakte hain:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>Ye link sirf **15 minutes** ke liye valid hai.</p>
            <p>Agar ye request aapne nahi ki thi, toh is email ko ignore karein.</p>
            <br/>
            <p>Regards,<br/>**Skyway IT Solution team**</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("BREVO FORGOT PASSWORD ERROR:", error?.response?.data || error.message);
    throw error;
  }
};