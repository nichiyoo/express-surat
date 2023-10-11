// import { join } from 'path';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';

// load env
import { config } from 'dotenv';
config();

// setup directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// live reload
if (process.env.NODE_ENV === 'development') {
	const reload = livereload.createServer();
	reload.server.once('connection', () => {
		setTimeout(() => {
			reload.refresh('/');
		}, 100);
	});

	reload.watch(path.join(__dirname, 'public'));
	reload.watch(path.join(__dirname, 'views'));
	app.use(connectLiveReload());
}

// routes
import apiRouter from './routes/api.route.js';
import authRouter from './routes/auth.route.js';
import usersRouter from './routes/users.route.js';
import formsRouter from './routes/forms.route.js';
import adminRouter from './routes/admins.route.js';
import { authenticate, authorize } from './middlewares/authenticate.js';

// unauthenticated routes
app.get('/', authenticate, function (req, res, next) {
	res.render('index', {
		title: 'Homepage',
		user: res.user,
	});
});

// authenticated routes
app.use('/api', apiRouter);
app.use('/auth', authenticate, authRouter);
app.use('/users', authenticate, usersRouter);
app.use('/forms', authenticate, formsRouter);
app.use('/admins', authenticate, authorize, adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error', {
		title: 'Error',
		route: '/error',
		status: err.status || 500,
		message: err.message,
	});
});

export default app;
