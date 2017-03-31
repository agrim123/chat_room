var crypto = require('crypto');

function hashpassword(password){
	return crypto.createHash('sha256').update(password).digest('base64').toString();
}

module.exports = hashpassword;