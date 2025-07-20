/* eslint-disable no-console */
import { Server } from 'http'
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log('connected to db');

        server = app.listen(envVars.PORT, () => {
            console.log('server running on port 5000');
        })
    } catch (error) {
        console.log(error);
    }
}

// IIFE for synchronous run
(async () => {
    await startServer()
    await seedSuperAdmin()
})()

process.on('unhandledRejection', (err) => {
    console.log('unHandle Rejection Detected... server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.log('uncaught eception detected... server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received... server shutting down');

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('SIGINT', () => {
    console.log('SIGINT signal received... server shutting down');

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

/** examples -
 * 1. unhandle rejection error :
 Promise.reject(new Error ("i forgot to cathch this promise"))
 * 
 2. uncaught exception error :
 throw new Error('i forgot to catch this local error')

 3. signal termination system error: 

 */
