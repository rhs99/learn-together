const Config = {
    LT_HOST: 'http://localhost:3000',

    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'lt-bucket',
    REDIS_HOST: 'lt-cache',
    REDIS_PORT: 6379,
};

module.exports = Config;
