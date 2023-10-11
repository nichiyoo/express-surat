import prisma from '../database/prisma.js';
import { validationResult } from 'express-validator';

async function riwayat(req, res, next) {
	try {
		// get query
		const current = Number.parseInt(req.query.page, 10) || 1;
		const limit = Number.parseInt(req.query.limit, 10) || 10;
		const tipe = req.query.tipe || 'All';
		if (!['Praktek', 'Skripsi', 'Penelitian', 'All'].includes(tipe)) {
			res.status(400).json({
				status: 'fail',
				message: 'Tipe form tidak valid',
			});
			return;
		}

		// get all forms if tipe is All
		if (tipe === 'All') {
			const count = await prisma.formulir.count();
			if (count === 0) {
				res.status(200).json({
					status: 'success',
					message: 'Data form kosong',
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

			const forms = await prisma.formulir.findMany({
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
			return;
		}

		// get counts if tipe is not All
		const count = await prisma.formulir.count({
			where: {
				tipe,
			},
		});

		if (count === 0) {
			res.status(200).json({
				status: 'success',
				message: `Data form ${tipe} kosong`,
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

		const forms = await prisma.formulir.findMany({
			where: {
				tipe,
			},
			take: limit,
			skip: (current - 1) * limit,
			include: {
				user: true,
			},
		});

		res.status(200).json({
			status: 'success',
			message: `Data form ${tipe} berhasil didapatkan`,
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

export default { riwayat };
