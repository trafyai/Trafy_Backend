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

function sendEmail({ email, formType }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@trafyai.com",
        pass: "bkci mtei pwbj gxjh",
      },
    });

    let mailConfigs = {
      from: 'Trafyai <info@trafyai.com>',
      to: email, // Add recipient email here
      subject: '',
      html: '',
    };

    if (formType === 'courseEnquiry') {
      mailConfigs.subject = 'Thank You For Your Course Enquiry!';
      mailConfigs.html = `
        <p>Dear User,</p>
        <p>Thank you for your course enquiry. We appreciate your interest in our courses.</p>
        <p>We will review your enquiry and get back to you as soon as possible.</p>
        <br>
        <p>Best Regards,</p>
        <p>Trafy Team</p>
      `;
    } else if (formType === 'landingPage') {
      mailConfigs.subject = 'Thank You For Your Interest!';
      mailConfigs.html = `
        <p>Dear User,</p>
        <p>Thank you for your interest in our services. We appreciate your time.</p>
        <p>Your message has been received, and we will get back to you shortly.</p>
        <br>
        <p>Best Regards,</p>
        <p>Trafy Team</p>
      `;
    }

    transporter.sendMail(mailConfigs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.post("/course-enquiry/submit", (req, res) => {
  const { email } = req.body;
  sendEmail({ email, formType: 'courseEnquiry' })
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/landing-page/submit", (req, res) => {
  const { email } = req.body;

  // Process the email data and send email
  sendEmail({ email, formType: 'landingPage' })
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailer is listening at http://localhost:${port}`);
});