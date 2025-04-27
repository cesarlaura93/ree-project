import { registerAs } from '@nestjs/config';

export default registerAs('environment', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ree-balance',
        user: process.env.MONGODB_USER || '',
        password: process.env.MONGODB_PASSWORD || '',
        dbName: process.env.MONGODB_DB_NAME || 'ree-balance',
    },
    reeApi: {
        baseUrl: process.env.REE_API_BASE_URL || 'https://apidatos.ree.es/es/datos/balance/balance-electrico',
        timeout: parseInt(process.env.REE_API_TIMEOUT || '30000', 10),
        retryAttempts: parseInt(process.env.REE_API_RETRY_ATTEMPTS || '3', 10),
    },
    scheduler: {
        enabled: process.env.SCHEDULER_ENABLED === 'true',
        interval: process.env.SCHEDULER_INTERVAL || '@hourly',
    },
    graphql: {
        playground: process.env.GRAPHQL_PLAYGROUND === 'true',
        debug: process.env.GRAPHQL_DEBUG === 'true',
    },
}));