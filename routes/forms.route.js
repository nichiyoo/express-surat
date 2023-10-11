import { Router } from 'express';
const router = Router();

router.get('/praktek', function (req, res, next) {
	res.render('forms/praktek', {
		title: 'Praktek',
		user: res.user, // from authenticate middleware
	});
});

router.get('/skripsi', function (req, res, next) {
	res.render('forms/skripsi', {
		title: 'Skripsi',
		user: res.user, // from authenticate middleware
	});
});

router.get('/penelitian', function (req, res, next) {
	res.render('forms/penelitian', {
		title: 'Penelitian',
		user: res.user, // from authenticate middleware
	});
});

export default router;
