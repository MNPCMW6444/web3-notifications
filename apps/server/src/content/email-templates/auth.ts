export const guestRegisterReq = (url: string) => ({
  subject: "Complete Your w3notif Member Account Setup",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome to w3notif: Elevate Your Workspace Experience</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-sizing: border-box;
        }
        .header, .footer {
            background-color: #4A90E2; /* w3notif brand color */
            color: white;
            text-align: center;
            padding: 10px;
        }
        .content {
            padding: 20px;
        }
        a.activate-button {
            background-color: #4A90E2; /* w3notif brand color */
            color: #ffffff;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h2>Welcome to w3notif</h2>
    </div>

    <div class="content">
        <p>Hello,</p>
        <p>Welcome to w3notif, the premium marketplace for corner offices. Enhance your productivity and elevate your work experience by booking a premium private office space on the go. Let's get your journey started.</p>

        <a href="${url}" class="activate-button">Activate Your Account</a>

        <p>If you did not request this, please disregard this email.</p>

        <h3>Share Your Experience</h3>
        <p>Your feedback is crucial for us. After experiencing our service, we would love to hear from you. Please feel free to reply to this email with your suggestions and thoughts.</p>

        <p>Here's to maximum productivity,<br><strong>The w3notif Team</strong></p>
    </div>

    <div class="footer">
        <p>Unsubscribe | &copy; 2024 w3notif Inc, All rights reserved.</p>
    </div>
</div>
</body>
</html>  `,
});

export const hostRegisterReq = (url: string) => ({
  subject: "Join the w3notif Network: Start Hosting Today",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Join the w3notif Network</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-sizing: border-box;
        }
        .header, .footer {
            background-color: #4A90E2; /* w3notif brand color */
            color: white;
            text-align: center;
            padding: 10px;
        }
        .content {
            padding: 20px;
        }
        a.activate-button {
            background-color: #4A90E2; /* w3notif brand color */
            color: #ffffff;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h2>Become an w3notif Host</h2>
    </div>

    <div class="content">
        <p>Hello,</p>
        <p>Thank you for your interest in joining w3notif as a host. w3notif offers a unique opportunity to monetize your premium office space and connect with professionals seeking exceptional work environments. Let's get your space listed and start your hosting journey.</p>

        <a href="${url}" class="activate-button">Set Up Your Host Account</a>

        <p>If you did not sign up to be a host, please ignore this email.</p>

        <h3>Ready to Help</h3>
        <p>Our team is here to assist you in making the most out of your hosting experience. Should you have TODO questions or need guidance, do not hesitate to get in touch.</p>

        <p>Thank you for choosing w3notif,<br><strong>The w3notif Team</strong></p>
    </div>

    <div class="footer">
        <p>Unsubscribe | &copy; 2024 w3notif Inc, All rights reserved.</p>
    </div>
</div>
</body>
</html>`,
});

export const resetPassword = (url: string) => ({
  subject: "Reset Your w3notif Password",
  body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - w3notif</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-sizing: border-box;
        }
        .header, .footer {
            background-color: #4A90E2; /* w3notif brand color */
            color: white;
            text-align: center;
            padding: 10px;
        }
        .content {
            padding: 20px;
        }
        a.button {
            background-color: #4A90E2; /* w3notif brand color */
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h2>Password Reset Instructions</h2>
    </div>

    <div class="content">
        <p>Hello,</p>

        <p>We received a request to reset your password for your w3notif account. If you made this request, please click the button below to choose a new password:</p>

        <a href="${url}" class="button">Reset Password</a>

        <p>If you did not request a password reset, please ignore this email or contact us if you have concerns.</p>

        <p>Best regards,<br><strong>The w3notif Team</strong></p>
    </div>

    <div class="footer">
        <p>Unsubscribe | &copy; 2024 w3notif Inc, All rights reserved.</p>
    </div>
</div>
</body>
</html>`,
});
