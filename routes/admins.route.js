import { Router } from 'express';
const router = Router();

router.get('/riwayat', function (req, res, next) {
	res.render('admins/riwayat', {
		title: 'Riwayat',
		user: res.user, // from authenticate middleware
	});
});

export default router;
