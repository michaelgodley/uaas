const bunyan = require('bunyan');
const logConfig = require('../env/log.json');

module.exports = (function() {
    let log;
    function init() {
	log = bunyan.createLogger({name: logConfig.name, 
				   src: logConfig.src,
				   streams: [
				       {
					   level: logConfig.stream.level,
					   stream: process.stdout
				       },
				       {
					   type: 'rotating-file',
					   path: logConfig.rotatingfile.path,
					   period: logConfig.rotatingfile.period,
					   count: logConfig.rotatingfile.count,
					   level: logConfig.rotatingfile.level
				       }
				   ],
				   serializers: {
				       req: bunyan.stdSerializers.req,
				       res: bunyan.stdSerializers.res
				   }				       
				  });
	log.info({mod :'log'}, 'Log Created');
    }

    return {
	getLogger : function() {
	    if(!log) {
		init();
	    }
	    return log;
	}	    
    };
})();

