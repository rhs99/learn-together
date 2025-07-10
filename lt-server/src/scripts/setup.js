const mongoose = require('mongoose');
const Privilege = require('../models/privilege');
const User = require('../models/user');

const DB_URL = process.env.MONGODB_URI;

const createAdminPrivilege = async () => {
    try {
        console.log('Checking if admin privilege exists...');
        let adminPrivilege = await Privilege.findOne({ name: 'admin' }).exec();
        if (adminPrivilege) {
            console.log('Admin privilege already exists, using existing one');
            return adminPrivilege;
        }
        console.log('Creating new admin privilege...');
        adminPrivilege = new Privilege({ name: 'admin' });
        adminPrivilege = await adminPrivilege.save();
        console.log('Admin privilege created successfully');
        return adminPrivilege;
    } catch (error) {
        console.error('Error creating admin privilege:', error.message);
        throw new Error(error);
    }
};

const createDefaultPrivilege = async () => {
    try {
        console.log('Checking if default privilege exists...');
        let defaultPrivilege = await Privilege.findOne({ name: 'default' }).exec();
        if (defaultPrivilege) {
            console.log('Default privilege already exists, using existing one');
            return defaultPrivilege;
        }
        console.log('Creating new default privilege...');
        defaultPrivilege = new Privilege({ name: 'default' });
        defaultPrivilege = await defaultPrivilege.save();
        console.log('Default privilege created successfully');
        return defaultPrivilege;
    } catch (error) {
        console.error('Error creating default privilege:', error.message);
        throw new Error(error);
    }
};

const setup = async () => {
    try {
        console.log('Starting setup process...');
        console.log(`Connecting to database at ${DB_URL}...`);
        await mongoose.connect(DB_URL, { dbName: 'lt-db' });
        console.log('Successfully connected to database');

        console.log('Setting up admin privilege...');
        const adminPrivilege = await createAdminPrivilege();

        console.log('Creating super user with credentials:');
        console.log(`- Username: ${process.env.ADMIN_USERNAME}`);
        console.log(`- Email: ${process.env.ADMIN_EMAIL}`);

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log(`Admin user with email ${process.env.ADMIN_EMAIL} already exists, skipping creation`);
        } else {
            const superUser = new User({
                userName: process.env.ADMIN_USERNAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                privileges: [adminPrivilege._id],
            });
            await superUser.save();
            console.log('Admin user created successfully');
        }

        console.log('Setting up default privilege...');
        await createDefaultPrivilege();

        console.log('Setup completed successfully!');
        console.log('Disconnecting from database...');
        await mongoose.disconnect();
        console.log('Disconnected from database');
    } catch (error) {
        console.error('Error during setup process:');
        console.error(error);
        console.log('Attempting to disconnect from database...');
        try {
            await mongoose.disconnect();
            console.log('Disconnected from database');
        } catch (disconnectError) {
            console.error('Error disconnecting from database:', disconnectError.message);
        }
        process.exit(1);
    }
};

// Check if required environment variables are present
const checkEnvVariables = () => {
    const requiredVars = ['MONGODB_URI', 'ADMIN_USERNAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Error: Missing required environment variables:');
        missingVars.forEach((varName) => {
            console.error(`- ${varName}`);
        });
        console.error('Please make sure these variables are defined in your .env file');
        process.exit(1);
    } else {
        console.log('All required environment variables are present');
    }
};

console.log('==================================');
console.log('Starting Learn Together setup script');
console.log('==================================');
checkEnvVariables();
setup()
    .then(() => {
        console.log('==================================');
        console.log('Setup completed successfully');
        console.log('==================================');
    })
    .catch((err) => {
        console.error('==================================');
        console.error('Setup failed with error:', err.message);
        console.error('==================================');
        process.exit(1);
    });
