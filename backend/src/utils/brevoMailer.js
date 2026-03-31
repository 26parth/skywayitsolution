// backend/src/utils/brevoMailer.js
import axios from "axios";
import path from "path";
import fs from "fs"; // Fallback ke liye module rakha hai

export const sendCertificateEmail = async (toEmail, toName, filePath) => {
  try {
    let content;
    let filename;

    // 1. Agar path Cloudinary ka URL hai (https se start ho raha hai)
    if (filePath.startsWith('http')) {
      const responseFile = await axios.get(filePath, { responseType: 'arraybuffer' });
      content = Buffer.from(responseFile.data).toString("base64");
      filename = path.basename(filePath);
    } 
    // 2. Agar path local file ka hai (In case koi change ho)
    else {
      const fileBuffer = await fs.promises.readFile(filePath);
      content = fileBuffer.toString("base64");
      filename = path.basename(filePath);
      
      // Local file send hone ke baad delete karna best practice hai
      try { await fs.promises.unlink(filePath); } catch (e) {}
    }

    // 3. Brevo API Call
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
            type: "application/pdf"
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