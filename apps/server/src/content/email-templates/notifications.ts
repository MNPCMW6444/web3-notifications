export const newMessage = (
  fromName: string,
  messagePreview: string,
  appUrl: string,
) => ({
  subject: `You've Got a New Message from ${fromName} on w3notif!`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Message Notification - w3notif</title>
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
        a.reply-button {
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
        <h2>You've Got a New Message!</h2>
    </div>

    <div class="content">
        <p>Hello,</p>
        <p>You have received a new message from <strong>${fromName}</strong> on w3notif. Here's a quick preview:</p>

        <blockquote>${messagePreview}</blockquote>

        <a href="${appUrl}" class="reply-button">Reply in App</a>

        <p>If you believe this was sent to you in error, please disregard this email.</p>

        <p>Stay connected,<br><strong>The w3notif Team</strong></p>
    </div>

    <div class="footer">
        <p>Unsubscribe | &copy; 2024 w3notif Inc, All rights reserved.</p>
    </div>
</div>
</body>
</html>  `,
});

export const newBooking = (
  fromName: string,
  bookingDetails: string,
  appUrl: string,
) => ({
  subject: `You've Got a New Booking from ${fromName} on w3notif!`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Booking Notification - w3notif</title>
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
        a.view-booking-button {
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
        <h2>You've Got a New Booking!</h2>
    </div>

    <div class="content">
        <p>Hello,</p>
        <p>You have received a new booking from <strong>${fromName}</strong> on w3notif. Here are the details:</p>

        <blockquote>${bookingDetails}</blockquote>

        <a href="${appUrl}" class="view-booking-button">View Booking in App</a>

        <p>If you believe this was sent to you in error, please disregard this email.</p>

        <p>Stay connected,<br><strong>The w3notif Team</strong></p>
    </div>

    <div class="footer">
        <p>Unsubscribe | &copy; 2024 w3notif Inc, All rights reserved.</p>
    </div>
</div>
</body>
</html>  `,
});
