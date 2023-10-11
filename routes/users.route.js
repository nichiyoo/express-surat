import { Router } from 'express';
const router = Router();

router.get('/profile', function (req, res, next) {
	res.render('users/profile', {
		title: 'Profile',
		user: res.user, // from authenticate middleware
	});
});

router.get('/dashboard', function (req, res, next) {
	res.render('users/dashboard', {
		title: 'Dashboard',
		user: res.user, // from authenticate middleware
		routes: {
			praktek: res.user.role === 'Admin' ? '/admins/riwayat?tipe=Praktek' : '/forms/praktek',
			skripsi: res.user.role === 'Admin' ? '/admins/riwayat?tipe=Skripsi' : '/forms/skripsi',
			penelitian: res.user.role === 'Admin' ? '/admins/riwayat?tipe=Penelitian' : '/forms/penelitian',
		},
	});
});

router.get('/riwayat', function (req, res, next) {
	res.render('users/riwayat', {
		title: 'Riwayat',
		user: res.user, // from authenticate middleware
	});
});

export default router;
