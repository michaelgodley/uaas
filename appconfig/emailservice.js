const config = require('../env'),
      log = require('./logger');
      mailgun = require('mailgun-js')({apiKey: config.mailgun.apikey, domain: config.mailgun.domain});

let emailService = {
    sendEmail: (recipient, message) => {
	log.trace({mod: 'mailgun'}, `Send mail to ${recipient}`);
	const data = {
	    from: `admin@${config.mailgun.domain}`,
	    to: recipient,
	    subject: message.subject,
	    text: message.text
	}
	
	//mailgun.messages.send(data, (err, body) => {

	//});
    },

    contactForm: (sender, message) => {

    }
};

module.exports = emailService;
