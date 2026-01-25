const Config = {
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'lt-bucket',
    CACHE_ENABLED: process.env.CACHE_ENABLED === 'true',
    REDIS_HOST: process.env.REDIS_HOST || 'lt-cache',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
};

module.exports = Config;
