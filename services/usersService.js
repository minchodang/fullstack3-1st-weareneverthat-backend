const usersDao = require('../models/usersDao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'minsu';

const signUp = async (email, password, name) => {
	const [user] = await usersDao.getUserByEmail(email);

	if (user) {
		const error = new Error('가입하신 내역이 존재합니다!');
		error.statusCode = 409;

		throw error;
	} else {
		const hashed = await bcrypt.hash(password, 10);
		console.log(hashed);
		return await usersDao.createUser(email, (password = hashed), name);
	}
};

const signIn = async (email, password) => {
	console.log('email in services', email);
	const [user] = await usersDao.getUserByEmail(email);

	if (!user) {
		const error = new Error('유효하지 않은 정보입니다.');
		error.statusCode = 409;
		throw error;
	}
	const validPassword = await bcrypt.compare(password, user.password);
	console.log(password);
	if (!validPassword) {
		const error = new Error('유효하지 않은 정보입니다.');
		error.statusCode = 409;
		throw error;
	}
	const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
	return token;
};

module.exports = { signIn, signUp };