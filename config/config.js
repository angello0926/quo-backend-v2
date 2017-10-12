var config = {
	env: process.env.NODE_ENV || 'development',
	logging: false,
};

var envConfig = require('./' + config.env);

module.exports = Object.assign(config, envConfig || {});