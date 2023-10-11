import { Router } from 'express';
import { checkSchema } from 'express-validator';
const router = Router();

// controllers
import UserController from '../controllers/users.controller.js';
import FormController from '../controllers/forms.controller.js';
import AdminController from '../controllers/admins.controller.js';

// middlewares
import Upload from '../middlewares/upload.js';
import { authenticate, authorize } from '../middlewares/authenticate.js';

// routes auth
router.post(
	'/users/register',
	checkSchema({
		nim: {
			notEmpty: { errorMessage: 'NIM tidak boleh kosong' },
			isNumeric: { errorMessage: 'NIM harus berupa angka' },
			isLength: { options: { min: 8, max: 8 }, errorMessage: 'NIM harus 8 digit' },
		},
		telepon: {
			notEmpty: { errorMessage: 'Telepon tidak boleh kosong' },
			isMobilePhone: { options: 'id-ID', errorMessage: 'Telepon tidak valid' },
		},
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		password: {
			notEmpty: { errorMessage: 'Password tidak boleh kosong' },
			isLength: { options: { min: 8, max: 20 }, errorMessage: 'Password harus 8-20 karakter' },
		},
	}),
	UserController.register
);

router.post(
	'/users/login',
	checkSchema({
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		password: {
			notEmpty: { errorMessage: 'Password tidak boleh kosong' },
			isLength: { options: { min: 8, max: 20 }, errorMessage: 'Password harus 8-20 karakter' },
		},
	}),
	UserController.login
);

router.post('/users/logout', UserController.logout);

router.put(
	'/users/update',
	authenticate,
	checkSchema({
		nim: {
			notEmpty: { errorMessage: 'NIM tidak boleh kosong' },
			isNumeric: { errorMessage: 'NIM harus berupa angka' },
			isLength: { options: { min: 8, max: 8 }, errorMessage: 'NIM harus 8 digit' },
		},
		telepon: {
			notEmpty: { errorMessage: 'Telepon tidak boleh kosong' },
			isMobilePhone: { options: 'id-ID', errorMessage: 'Telepon tidak valid' },
		},
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		password: {
			notEmpty: { errorMessage: 'Password tidak boleh kosong' },
			isLength: { options: { min: 8, max: 20 }, errorMessage: 'Password harus 8-20 karakter' },
		},
		newPassword: {
			optional: { options: { nullable: true } },
			isLength: { options: { min: 8, max: 20 }, errorMessage: 'Password Baru harus 8-20 karakter' },
		},
	}),
	UserController.update
);

// routes forms
router.get('/forms/riwayat', authenticate, FormController.riwayat);

router.post(
	'/forms/praktek',
	authenticate,
	Upload.single('proposal'),
	checkSchema({
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		nim: {
			notEmpty: { errorMessage: 'NIM tidak boleh kosong' },
			isNumeric: { errorMessage: 'NIM harus berupa angka' },
			isLength: { options: { min: 8, max: 8 }, errorMessage: 'NIM harus 8 digit' },
		},
		instansi: {
			notEmpty: { errorMessage: 'Instansi tidak boleh kosong' },
			isLength: { options: { min: 5, max: 50 }, errorMessage: 'Instansi harus 5-50 karakter' },
		},
		tipe: {
			notEmpty: { errorMessage: 'Tipe tidak boleh kosong' },
			matches: { options: [/^Praktek$/], errorMessage: 'Tipe form tidak valid' },
		},
	}),
	FormController.praktek
);

router.post(
	'/forms/skripsi',
	authenticate,
	checkSchema({
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		nim: {
			notEmpty: { errorMessage: 'NIM tidak boleh kosong' },
			isNumeric: { errorMessage: 'NIM harus berupa angka' },
			isLength: { options: { min: 8, max: 8 }, errorMessage: 'NIM harus 8 digit' },
		},
		judul: {
			notEmpty: { errorMessage: 'Judul tidak boleh kosong' },
			isLength: { options: { min: 5, max: 50 }, errorMessage: 'Judul harus 5-50 karakter' },
		},
		instansi: {
			notEmpty: { errorMessage: 'Instansi tidak boleh kosong' },
			isLength: { options: { min: 5, max: 50 }, errorMessage: 'Instansi harus 5-50 karakter' },
		},
		tipe: {
			notEmpty: { errorMessage: 'Tipe tidak boleh kosong' },
			matches: { options: [/^Skripsi$/], errorMessage: 'Tipe form tidak valid' },
		},
	}),
	FormController.skripsi
);

router.post(
	'/forms/penelitian',

	authenticate,
	checkSchema({
		username: {
			notEmpty: { errorMessage: 'Username tidak boleh kosong' },
			isLength: { options: { min: 5, max: 20 }, errorMessage: 'Username harus 5-20 karakter' },
		},
		nim: {
			notEmpty: { errorMessage: 'NIM tidak boleh kosong' },
			isNumeric: { errorMessage: 'NIM harus berupa angka' },
			isLength: { options: { min: 8, max: 8 }, errorMessage: 'NIM harus 8 digit' },
		},
		subjek: {
			notEmpty: { errorMessage: 'Subjek tidak boleh kosong' },
			isLength: { options: { min: 5, max: 50 }, errorMessage: 'Subjek harus 5-50 karakter' },
		},
		instansi: {
			notEmpty: { errorMessage: 'Instansi tidak boleh kosong' },
			isLength: { options: { min: 5, max: 50 }, errorMessage: 'Instansi harus 5-50 karakter' },
		},
		tipe: {
			notEmpty: { errorMessage: 'Tipe tidak boleh kosong' },
			matches: { options: [/^Penelitian$/], errorMessage: 'Tipe form tidak valid' },
		},
		tujuan: {
			notEmpty: { errorMessage: 'Tujuan tidak boleh kosong' },
			isLength: { options: { min: 30, max: 500 }, errorMessage: 'Tujuan harus 30-200 karakter' },
		},
	}),

	FormController.penelitian
);

router.get('/forms/download/:id/:field', authenticate, FormController.download);

// admins route
router.get('/admins/forms/riwayat', authenticate, AdminController.riwayat);

router.put(
	'/admins/forms/riwayat/:id/update',

	authenticate,
	Upload.single('surat'),

	FormController.update
);

router.put('/admins/forms/riwayat/:id/tolak', authenticate, FormController.tolak);

export default router;
