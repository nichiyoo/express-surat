import bcrypt from 'bcrypt';
import prisma from '../database/prisma.js';
import { Prisma } from '@prisma/client';
import { generate } from '../middlewares/authenticate.js';
import { validationResult } from 'express-validator';

async function register(req, res, next) {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Gagal mendaftarkan user',
				result,
			});
			return;
		}

		// create user
		const { nim, telepon, username, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const user = await prisma.user.create({
			data: {
				nim,
				telepon,
				username,
				password: hash,
			},
		});

		// create token
		const token = generate(user);
		res.status(200)
			.cookie('token', token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
			})
			.json({
				status: 'success',
				message: 'Registrasi user berhasil',
				data: {
					user,
					token,
				},
			});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log(error.meta);
				const path = error.meta.target.split('_')[1];
				const value = req.body[path];
				res.status(400).json({
					status: 'fail',
					message: 'Gagal mendaftarkan user',
					result: {
						errors: [
							{
								value,
								path,
								type: 'field',
								location: 'body',
								msg: `${path} sudah terdaftar`.replace(/^\w/, (c) => c.toUpperCase()),
							},
						],
					},
				});
				return;
			}
		}
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function login(req, res, next) {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Gagal mengautentikasi user',
				result,
			});
			return;
		}

		// check username
		const { username, password } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) {
			res.status(404).json({
				status: 'fail',
				message: 'Gagal mengautentikasi user',
				result: {
					errors: [
						{
							type: 'field',
							value: username,
							msg: 'Username tidak ditemukan',
							path: 'username',
							location: 'body',
						},
					],
				},
			});
			return;
		}

		// check password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.status(401).json({
				status: 'fail',
				message: 'Gagal mengautentikasi user',
				result: {
					errors: [
						{
							type: 'field',
							value: password,
							msg: 'Password salah atau tidak valid',
							path: 'password',
							location: 'body',
						},
					],
				},
			});
			return;
		}

		// create token
		const token = generate(user);
		res.status(200)
			.cookie('token', token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
			})
			.json({
				status: 'success',
				message: 'Login berhasil',
				data: {
					user,
					token,
				},
			});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function update(req, res, next) {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(400).json({
				status: 'fail',
				message: 'Data tidak valid',
				result,
			});
			return;
		}

		// check user
		const { id } = res.user;
		const { nim, telepon, username, password, newPassword } = req.body;
		const current = await prisma.user.findUnique({
			where: {
				id,
			},
		});
		if (!current) {
			res.status(404).json({
				status: 'fail',
				message: 'User tidak ditemukan',
				result: {
					errors: [
						{
							type: 'field',
							value: id,
							msg: 'Username tidak ditemukan',
							path: 'username',
							location: 'body',
						},
					],
				},
			});
			return;
		}

		// check password
		const match = await bcrypt.compare(password, current.password);
		if (!match) {
			res.status(401).json({
				status: 'fail',
				message: 'Password tidak valid',
				result: {
					errors: [
						{
							type: 'field',
							value: password,
							msg: 'Password salah atau tidak valid',
							path: 'password',
							location: 'body',
						},
					],
				},
			});
			return;
		}

		// update user
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword || password, salt);
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				nim,
				telepon,
				username,
				password: hash,
			},
		});

		// update token
		const token = generate(user);
		res.status(200)
			.cookie('token', token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
			})
			.json({
				status: 'success',
				message: 'Update user berhasil',
				data: {
					user,
					token,
				},
			});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log(error.meta);
				const path = error.meta.target.split('_')[1];
				const value = req.body[path];
				res.status(400).json({
					status: 'fail',
					message: 'Gagal mengupdate user',
					result: {
						errors: [
							{
								value,
								path,
								type: 'field',
								location: 'body',
								msg: `${path} sudah terdaftar`.replace(/^\w/, (c) => c.toUpperCase()),
							},
						],
					},
				});
				return;
			}
		}
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

async function logout(req, res, next) {
	try {
		res.clearCookie('token');
		res.status(200).json({
			status: 'success',
			message: 'Logout berhasil',
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: error.message,
		});
	}
}

export default { register, login, update, logout };
