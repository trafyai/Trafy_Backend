const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5002;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://trafyai.com'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

function sendEmail({ email, fname, course, formType }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@trafyai.com",
        pass: "bkci mtei pwbj gxjh",
      },
    });

    let mailConfigs = {
      from: 'trafyai <info@trafyai.com>',
      to: email,
      subject: '',
      html: '',
    };

    if (formType === 'newsletter') {
      mailConfigs.subject = 'Welcome to Our Newsletter!';
      mailConfigs.html = `
        <p>Dear Subscriber,</p>
        <p>Thank you for subscribing to our newsletter! We're excited to have you join us on this journey of learning and growth.</p>
        <p>Your support means the world to us, and we're committed to 
        delivering valuable content straight to your inbox. We can't wait to share insights, tips, and inspiration.
        </p>
        <br>
        <p>Best Regards,</p>
        <p>trafyai team</p>
      `;
    } else if (formType === 'courseEnquiry') {
      mailConfigs.subject = 'Thank You For Your Course Enquiry!';
      mailConfigs.html = `
      <p>Dear ${fname},</p>
      <p>Thank you for your interest in  ${course}! We're glad to assist you.</p>
      <p>Our team will contact you shortly to discuss your inquiry and provide more details about the course.</p>
      <p>Feel free to explore our website in the meantime. If you have any questions, contact us at info@trafyai.com .</p>
      <br>
      <p>Looking forward to speaking with you!</p>
      <p>Best regards,</p>
      <p>trafyai team</p>
      `;
    } else if (formType === 'freedemo') {
      mailConfigs.subject = ' Confirmation: Your Free Demo Enquiry';
      mailConfigs.html = `
        <p>Dear ${fname},</p>
        <p>Thank you for your interest in our free demo !</p>
        <p>Our team will contact you shortly to confirm the details and provide all necessary information.</p>
        <p>Feel free to explore our website in the meantime. If you have any questions, contact us at info@trafyai.com .</p>
        <br>
        <p>Looking forward to having you join us ! </p>
        <p>Best Regards,</p>
        <p>trafyai Team</p>
      `;
    }

    transporter.verify((error, success) => {
      if (error) {
        console.error("Error verifying transporter:", error);
        return reject({ message: `An error has occurred: ${error.message}` });
      } else {
        console.log("Server is ready to take our messages:", success);
        transporter.sendMail(mailConfigs, function (error, info) {
          if (error) {
            console.log("Error sending email:", error);
            return reject({ message: `An error has occurred: ${error.message}` });
          }
          console.log("Email sent successfully:", info.response);
          return resolve({ message: "Email sent successfully" });
        });
      }
    });
  });
}

app.post("/course-enquiry/submit", (req, res) => {
  const { email, fname, course } = req.body;
  sendEmail({ email, fname, course, formType: 'courseEnquiry' } )
    .then((response) => res.send(response.message))
    .catch((error) => {
      console.error("Error in /course-enquiry/submit:", error);
      res.status(500).send(error.message);
    });
});

app.post("/newsletter/submit", (req, res) => {
  const { email } = req.body;
  sendEmail({ email, formType: 'newsletter' })
    .then((response) => res.send(response.message))
    .catch((error) => {
      console.error("Error in /newsletter/submit:", error);
      res.status(500).send(error.message);
    });
});

app.post("/freedemo-form/submit", (req, res) => {
  const { email, fname } = req.body;
  sendEmail({ email, fname, formType: 'freedemo' })
    .then((response) => res.send(response.message))
    .catch((error) => {
      console.error("Error in /freedemo-form/submit:", error);
      res.status(500).send(error.message);
    });
});

app.listen(port, () => {
  console.log(`nodemailer is listening at http://localhost:${port}`);
});
