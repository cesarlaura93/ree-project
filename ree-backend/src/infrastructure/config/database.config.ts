import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs('database', (): MongooseModuleOptions => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ree-balance',
    autoIndex: true,
    connectionFactory: (connection) => {
        connection.on('connected', () => {
            console.log('MongoDB is connected');
        });
        connection.on('disconnected', () => {
            console.log('MongoDB is disconnected');
        });
        connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        return connection;
    },
    retryAttempts: 5,
    retryDelay: 5000,
    // Configuraciones adicionales para producción
    ...(process.env.NODE_ENV === 'production' && {
        authSource: 'admin',
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASSWORD,
    }),
}));

// Tipos auxiliares para la configuración
export interface DatabaseConfig {
    uri: string;
    autoIndex: boolean;
    retryAttempts: number;
    retryDelay: number;
    authSource?: string;
    user?: string;
    pass?: string;
}