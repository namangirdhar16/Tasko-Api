
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_KEY);

const sendWelcomeEmail = (name, email) => {
    const msg = {
        to: `${email}`, 
        from: 'girdharnaman1611@gmail.com', 
        subject: 'Welcome Email',
        text: `Thanks ${name} for joining us!`,
        
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      
}


const sendCancellationEmail = (name, email) => {
    const msg = {
        to: `${email}`, 
        from: 'girdharnaman1611@gmail.com', 
        subject: 'Cancellation Email',
        text: 'Ah! you left :(, please tell us why?',
    }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      
}

module.exports = {
    sendWelcomeEmail, 
    sendCancellationEmail
}

