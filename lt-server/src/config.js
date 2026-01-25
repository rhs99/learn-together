const Config = {
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,

    // Client Configuration
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    // Database Configuration
    USE_REMOTE_DB: process.env.USE_REMOTE_DB === 'true',
    MONGODB_URI: process.env.MONGODB_URI,
    REMOTE_MONGODB_URI: process.env.REMOTE_MONGODB_URI,

    // Supabase Configuration
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'lt-bucket',

    // Cache Configuration
    CACHE_ENABLED: process.env.CACHE_ENABLED === 'true',
    REDIS_HOST: process.env.REDIS_HOST || 'lt-cache',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),

    // Security
    SECRET_KEY: process.env.SECRET_KEY,

    // Email Configuration
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_EMAIL_PASS: process.env.ADMIN_EMAIL_PASS,
    ADMIN_EMAIL_HOST: process.env.ADMIN_EMAIL_HOST,
    ADMIN_EMAIL_PORT: process.env.ADMIN_EMAIL_PORT,
    ADMIN_EMAIL_SERVICE: process.env.ADMIN_EMAIL_SERVICE,

    // Admin Configuration
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

    // Logging Configuration
    LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    USE_CONSOLE_LOG: process.env.USE_CONSOLE_LOG === 'true',

    // Docker Configuration
    DOCKER_ENV: process.env.DOCKER_ENV === 'true',
};

module.exports = Config;
