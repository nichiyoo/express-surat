import fs from 'fs';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = `uploads/${file.fieldname}`;
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		cb(null, timestamp + path.extname(file.originalname));
	},
	onError: (err, next) => {
		console.log('error', err);
		next(err);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
	fileFilter: function (req, file, cb) {
		const filetypes = /pdf/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		if (mimetype && extname) return cb(null, true);
		cb('Error: Image upload only supports the following filetypes - ' + filetypes);
	},
});

export default upload;
