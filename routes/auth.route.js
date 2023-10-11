import { Router } from 'express';
const router = Router();

router.get('/login', function (req, res, next) {
	res.render('auth/login', {
		title: 'Login',
	});
});

router.get('/register', function (req, res, next) {
	res.render('auth/register', {
		title: 'Register',
	});
});

export default router;
