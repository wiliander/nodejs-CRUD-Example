var nodemailer = require('nodemailer');

function enviarEmail(callback, email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sistemas.airton@gmail.com',
            pass: 'xxxxx'
        }
    });

    var mailOptions = {
        from: 'sistemas.airton@gmail.com',
        to: email,
        subject: 'primeiro email teste',
        text: 'batatinha',
        //html: '<h1>hauahaua</h1>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            callback();
        }
    });
}

module.exports = {
    enviarEmail
}