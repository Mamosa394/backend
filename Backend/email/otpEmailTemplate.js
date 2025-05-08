import React from "react";
import ReactDOMServer from "react-dom/server";

const generateOtpEmail = ({ username, otp }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              padding: 20px;
              text-align: center;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            .email-header {
              background-color: #0e594a;
              padding: 15px;
              color: #fff;
              text-align: center;
            }
            .email-header img {
              width: 100px;
              margin-bottom: 10px;
            }
            .otp-box {
              font-size: 24px;
              font-weight: bold;
              color: #0e594a;
              margin: 20px 0;
            }
            .otp-instructions {
              color: #555;
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              color: #555;
              font-size: 12px;
            }
          `}
        </style>
      </head>
      <body>
        <div className="email-container">
          <div className="email-header">
            <img src="https://yourdomain.com/images/logo.jpg" alt="Logo" />
            <h2>OTP Verification</h2>
          </div>
          <div className="otp-box">
            <p>
              Your OTP is: <strong>{otp}</strong>
            </p>
          </div>
          <p className="otp-instructions">
            Hello {username},<br />
            Use the OTP above to verify your account and proceed with login.
          </p>
          <div className="footer">
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export const generateOtpEmailHtml = ({ username, otp }) => {
  return ReactDOMServer.renderToStaticMarkup(
    generateOtpEmail({ username, otp })
  );
};
