const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// load env variable
dotenv.config({ path: './config/config.env' });

// load models

const Peak = require('./models/Peak');
const User = require('./models/User');

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// read json
const peaks = JSON.parse(fs.readFileSync(`${__dirname}/_data/peaks.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

// import data to DB
const importData = async () => {
    try {
        await Peak.create(peaks);
        await User.create(users);
        console.log('data imported');
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// delete data from  DB
const deleteData = async () => {
    try {
        await Peak.deleteMany();
        await User.deleteMany();
        console.log('data deleted');
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// determine which func to run

if (process.argv[2] === '-i') {
    importData();
    } else if (process.argv[2] === '-d') {
        deleteData();
    }
