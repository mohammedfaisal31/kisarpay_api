const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require("mysql2");

//create databse connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "65109105@mysql",
  database: "otp_service"
});

con.connect((err)=> {
		if(err) console.log(err)
		else console.log("Connected")
})
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
    pass: 'volxbfhprepvvlqc',
  },
});

// endpoint to send email and OTP
app.post('/api/register', (req, res) => {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000);

  // send the OTP via email
  transporter.sendMail({
    from: 'verify@kisarpay.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for kisarpay is ${otp}`,
  }, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      const sql = `INSERT INTO OTPEntries (email, OTP) VALUES ("${email}", "${otp}")`;
	  con.query(sql, function (err, result) {
			if (err) return res.send(err);
			else return res.status(200).send({"status":"ok"});
		});
	}
  });
});


app.post('/api/otp/verify', (req, res) => {
  const email = req.body.email;
  const userOtp = req.body.otp;
  console.log(userOtp,email);
  const sql = `SELECT OTP FROM OTPEntries where email="${email}"`;
	  con.query(sql, function (err, result) {
			if (err) console.log(err);
			if (userOtp === String(result[0]["OTP"])) {
				// OTP is valid
				res.status(200).send({ message: 'OK' })
				
			} else {
				res.status(200).send({ message: 'BAD' })
			}
		});
});

app.delete('/api/remove/entry/:email', (req, res) => {
  const email = req.params.email;
  let sql = `DELETE FROM OTPEntries WHERE email='${email}'`
  console.log(sql)
  con.query(sql,(err,result)=>{
					if(err) {
						res.status(200).send(sql);
					}
					else  res.status(200).send({ message: 'OK' });
				})
});

// start the server
app.listen(3500, () => {
  console.log('Server started on port 3500');
});

function getOtpForEmail(email) {
  const sql = `SELECT OTP FROM OTPEntries where email="${email}"`;
	  con.query(sql, function (err, result) {
			if (err) console.log(err);
			return result[0]["OTP"];
		});
  
}
