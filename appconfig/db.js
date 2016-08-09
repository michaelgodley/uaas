const mongoose = require('mongoose');
const log = require('./logger').getLogger();

class DBConnection {
    constructor(name = 'app', host = 'localhost', port = 27017, protocol = 'mongodb') {
	this.dBProtocol = protocol;
	this.dBHost = host;
	this.dBPort = port;
	this.dBName = name;
	this.dBConnURL = `${protocol}://${host}:${port}/${name}`;
	log.debug({mod: 'db'}, `MongoDB Connection ${this.dBConnURL}`);
	this.dB = mongoose.connect(this.dBConnURL, (err) => {
	    if (err) {
		log.error({mod: 'db'}, err);
	    } else {
		log.info({mod: 'db'}, `Successfully connected to MongoDB on ${this.dBConnURL}`);
	    }
	});
    }
    
    get db() {
	return this.dB;
    }
}

module.exports = DBConnection;
