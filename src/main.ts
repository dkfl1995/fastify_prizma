import fastify from 'fastify';
import userRouter from './routes/user.router';
import postRouter from './routes/message.router';
import loadConfig from './config/env.config';
import { utils } from './utils';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import JoiCompiler from 'joi-compiler';
import fs from 'fs';

const joiSchemaCompiler = JoiCompiler();
loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);

const checkDynamicFolders = () => {
  try {
    const info = fs.statSync('./uploads');
    // check if uploads folder exists
    if (!info.isDirectory()) {
      fs.mkdirSync('./uploads');
    }
  } catch (e) {
    e.code === 'ENOENT' && fs.mkdirSync('./uploads');
  }
}

const startServer = async () => {
  checkDynamicFolders();
  const server = fastify({
    logger: { level: process.env.LOG_LEVEL },
    schemaController: { 
      bucket: joiSchemaCompiler.bucket, 
      compilersFactory: {
        buildValidator: joiSchemaCompiler.buildValidator,
      } 
    },
  });

  // Register middlewares
  server.register(formbody);
  server.register(cors);
  server.register(helmet);
  server.register(multipart)

  // Register routes
  server.register(userRouter, { prefix: '/api/account' });
  server.register(postRouter, { prefix: '/api/message' });

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Something went wrong' });
  });

  // Health check route
  server.get('/health', async (_request, reply) => {
    try {
      await utils.healthCheck();
      reply.status(200).send({
        message: 'Health check endpoint success.',
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Health check endpoint failed.',
      });
    }
  });

  // Root route
  server.get('/', (request, reply) => {
    reply.status(200).send({ message: 'Hello from fastify boilerplate!' });
  });

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  // Start server
  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
