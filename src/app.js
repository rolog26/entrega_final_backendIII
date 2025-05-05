import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const connection = mongoose.connect(process.env.URL_MONGO)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de adopción de mascotas',
            version: '1.0.0',
            description: 'Sistema de adopción de mascotas',
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.listen(process.env.PORT,()=>console.log(`Listening on ${process.env.PORT}`))
