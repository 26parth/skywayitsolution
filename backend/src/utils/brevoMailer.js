// backend/src/utils/brevoMailer.js
import axios from "axios";
import fs from "fs";
import path from "path";

export const sendCertificateEmail = async (toEmail, toName, filePath) => {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const content = fileBuffer.toString("base64");
    const filename = path.basename(filePath);

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
            content,
            name: filename,
          },
        ],
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // ✅ MAIN FIX
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
