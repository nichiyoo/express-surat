import jwt from 'jsonwebtoken';

function generate(user) {
	const token = jwt.sign(
		{
			id: user.id,
			nim: user.nim,
			role: user.role,
			telepon: user.telepon,
			username: user.username,
		},
		process.env.JWT_SECRET,
		{ expiresIn: '2h' }
	);
	return token;
}

function authenticate(req, res, next) {
	const token = req.cookies.token;
	const url = req.originalUrl;

	if (!token) {
		res.user = null;
		res.clearCookie('token');
		if (!url.startsWith('/auth') && url != '/') {
			res.redirect('/');
			return;
		}
		next();
		return;
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			res.user = null;
			res.clearCookie('token');
			if (!url.startsWith('/auth') && url != '/') {
				res.redirect('/');
				return;
			}
			next();
			return;
		}

		res.user = user;
		if (req.originalUrl.startsWith('/auth')) {
			res.redirect('/');
			return;
		}
		next();
	});
}

function authorize(req, res, next) {
	if (res.user.role != 'Admin') {
		res.redirect('/');
		return;
	}
	next();
}

export { generate, authenticate, authorize };
