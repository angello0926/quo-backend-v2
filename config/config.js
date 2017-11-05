const config = {
	env: process.env.NODE_ENV || 'development',
	logging: false
};

const envConfig = require('./' + config.env);

module.exports = Object.assign(config, envConfig || {});