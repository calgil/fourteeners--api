const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const cookieParser = require('cookie-parser');
dotenv.config({ path: './config/config.env' });

connectDB();

// accesskeyid = 'AKIAZHU7DCBQ2W46GDGW '
// secretaccesskey = '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'

//Route files
const peaks = require('./routes/peaks');
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();
// parse json

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, 
	max: 100,
})

app.use(limiter);

// Mount Routers
app.use('/api/v1/peaks', peaks);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;


const server = app.listen(
    PORT, 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});