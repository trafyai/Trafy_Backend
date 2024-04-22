const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5000;

const corsOptions = {
  origin: 'https://trafyai.com/course-enquiry'
  , // replace with your frontend domain
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

function sendEmail({ email, message }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@trafyai.com",
        pass: "bkci mtei pwbj gxjh",
      },
    });

    const mail_configs = {
      from: 'trafyai <info@trafyai.com>',
      to: email,
      subject: 'Thank You For submitting the Form !',
      html: `
        <p>Dear User,</p>
        <p>Thank you for submitting the form. We appreciate your interest in our services.</p>
        <p>Your message has been received, and we will get back to you shortly.</p>
        <br>
        <p>Best Regards,</p>
        <p>Trafy Team</p>
      `,
    };
    
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  }); 
}

app.post("/submit", (req, res) => {
  const { email, message } = req.body;
  sendEmail({ email, message })
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailer is listening at http://localhost:${port}`);
});
