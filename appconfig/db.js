const mongoose = require('mongoose');
const log = require('./logger').getLogger();

class DBConnection {
    constructor(protocol = 'mongodb', host = 'localhost', port = 27017, dBName = 'theapp') {
	this.dbProtocol = protocol;
	this.dbHost = host;
	this.dBPort = port;
	this.dBName = dBName;
	this.dBConnURL = `${protocol}://${host}:${port}/${dBName}`;
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
