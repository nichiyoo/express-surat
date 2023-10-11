import fs from 'fs';
import prisma from '../database/prisma.js';
import { validationResult } from 'express-validator';

async function riwayat(req, res, next) {
	try {
		// get query
		const current = Number.parseInt(req.query.page, 10) || 1;
		const limit = Number.parseInt(req.query.limit, 10) || 10;

		// get counts
		const { id } = res.user;
		const count = await prisma.formulir.count({
			where: {
				userId: id,
			},
		});

		// if no data
		if (count === 0) {
			res.status(200).json({
				status: 'success',
				message: 'Data form user kosong',
				data: {
					current,
					limit,
					count,
					total: 0,
					forms: [],
				},
			});
			return;
		}

		// find all forms
		const forms = await prisma.formulir.findMany({
			where: {
				userId: id,
			},
			take: limit,
			skip: (current - 1) * limit,
			include: {
				user: true,
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Data form berhasil didapatkan',
			data: {
				current,
				limit,
				count,
				total: Math.ceil(count / limit),
				forms,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function praktek(req, res, next) {
	try {
		// validate form
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Data form praktek tidak valid',
				result,
			});
			return;
		}

		// create form
		const { id } = res.user;
		const { path } = req.file;
		const { tipe, instansi } = req.body;
		const form = await prisma.formulir.create({
			data: {
				tipe,
				instansi,
				proposal: path.replace(/\\/g, '/'),
				status: 'Menunggu',
				user: {
					connect: {
						id,
					},
				},
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Form praktek berhasil dibuat',
			data: {
				form,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function skripsi(req, res, next) {
	try {
		// validate form
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Data form skripsi tidak valid',
				result,
			});
			return;
		}

		// create form
		const { id } = res.user;
		const { judul, instansi } = req.body;
		const form = await prisma.formulir.create({
			data: {
				tipe: 'Skripsi',
				instansi,
				judul,
				status: 'Menunggu',
				user: {
					connect: {
						id,
					},
				},
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Form skripsi berhasil dibuat',
			data: {
				form,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function penelitian(req, res, next) {
	try {
		// validate form
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Data form penelitian tidak valid',
				result,
			});
			return;
		}

		// create form
		const { id } = res.user;
		const { subjek, tujuan, instansi } = req.body;
		const form = await prisma.formulir.create({
			data: {
				tipe: 'Penelitian',
				instansi,
				subjek,
				tujuan,
				status: 'Menunggu',
				user: {
					connect: {
						id,
					},
				},
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Form penelitian berhasil dibuat',
			data: {
				form,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

// api/admins/forms/download/:id
async function download(req, res, next) {
	try {
		const id = Number.parseInt(req.params.id, 10);
		const field = req.params.field;
		const form = await prisma.formulir.findUnique({
			where: {
				id,
			},
		});

		// if no form
		if (!form) {
			res.status(404).json({
				status: 'fail',
				message: 'Form tidak ditemukan',
			});
			return;
		}

		// if no proposal file
		if (field === 'proposal' && !form.proposal) {
			res.status(404).json({
				status: 'fail',
				message: 'Proposal tidak ditemukan atau belum diupload',
			});
			return;
		} else if (field === 'surat' && !form.surat) {
			res.status(404).json({
				status: 'fail',
				message: 'Surat tidak ditemukan atau belum diupload',
			});
			return;
		}

		// download file
		const url = field === 'proposal' ? form.proposal : form.surat;
		res.status(200).download(url);
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function update(req, res, next) {
	try {
		const user = res.user;
		if (user.role !== 'Admin') {
			res.status(401).json({
				status: 'fail',
				message: 'User tidak memiliki akses',
			});
			return;
		}

		const id = Number.parseInt(req.params.id, 10);
		const form = await prisma.formulir.findUnique({
			where: {
				id,
			},
		});

		// if no form
		if (!form) {
			res.status(404).json({
				status: 'fail',
				message: 'Form tidak ditemukan',
			});
			return;
		}

		// if form already accepted
		if (form.status !== 'Menunggu') {
			res.status(400).json({
				status: 'fail',
				message: 'Status form sudah diterima dan tidak dapat diupdate',
			});
			return;
		}

		// update form
		const { path } = req.file;
		await prisma.formulir.update({
			where: {
				id,
			},
			data: {
				surat: path.replace(/\\/g, '/'),
				status: 'Diterima',
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Form berhasil diupdate',
		});
	} catch (error) {
		const { path } = req.file;
		if (fs.lstatSync(path).isFile()) {
			fs.unlinkSync(path);
		}
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function tolak(req, res, next) {
	try {
		const user = res.user;
		if (user.role !== 'Admin') {
			res.status(401).json({
				status: 'fail',
				message: 'User tidak memiliki akses',
			});
			return;
		}

		// get form
		const id = Number.parseInt(req.params.id, 10);
		const form = await prisma.formulir.findUnique({
			where: {
				id,
			},
		});

		// if no form
		if (!form) {
			res.status(404).json({
				status: 'fail',
				message: 'Form tidak ditemukan',
			});
			return;
		}

		// if form already accepted
		if (form.status !== 'Menunggu') {
			res.status(400).json({
				status: 'fail',
				message: 'Status form sudah diterima dan tidak dapat ditolak',
			});
			return;
		}

		// update form
		await prisma.formulir.update({
			where: {
				id,
			},
			data: {
				status: 'Ditolak',
			},
		});

		res.status(200).json({
			status: 'success',
			message: 'Form berhasil ditolak',
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

export default { riwayat, praktek, skripsi, penelitian, download, update, tolak };
