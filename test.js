const express = require('express');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// use the cors middleware
app.use(cors());

// create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'verify.kisarpay@gmail.com',
    pass: '65109105@kisarpay',
  },
});

// endpoint to send email and OTP
app.post('/api/verify', (req, res) => {
  const email = req.body.email;

  // generate an OTP secret
  const secret = speakeasy.generateSecret();

  // send the OTP via email
  transporter.sendMail({
    from: 'verify@kisarpay.com',
    to: "mohammedfaisal3366@gmail.com",
    subject: 'OTP Verification',
    text: `Your OTP is ${secret.base32}`,
  }, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      res.status(200).send({ message: 'Email sent successfully' });
    }
  });
});



// start the server
app.listen(3500, () => {
  console.log('Server started on port 3500');
});
