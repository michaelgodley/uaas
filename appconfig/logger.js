const bunyan = require('bunyan');
const fs = require('fs');
const config = require('../env');

module.exports = (function() {
    let log;
    function init() {
	let logConfig = {};
	log = bunyan.createLogger({name: config.log.logname, 
				   src: config.log.src,
				   streams: [
				       {
					   level: config.log.stream.level,
					   stream: process.stdout
				       },
				       {
					   type: 'rotating-file',
					   path: config.log.rotatingfile.path,
					   period: config.log.rotatingfile.period,
					   count: config.log.rotatingfile.count,
					   level: config.log.rotatingfile.level
				       }
				   ],
				   serializers: {
				       req: bunyan.stdSerializers.req,
				       res: bunyan.stdSerializers.res
				   }				       
				  });
	log.info({mod :'log'}, 'Log Created');
    }
    if(!log) {
	init();
    }
    return log;    
})();

