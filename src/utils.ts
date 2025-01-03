import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import * as JWT from 'jsonwebtoken';
import Joi from 'joi';
import { FastifyReply, FastifyRequest } from 'fastify';

export const prisma = new PrismaClient();

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },

  getTime: (): number => {
    return new Date().getTime();
  },

  genSalt: (saltRounds: number, value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (!value) {
          throw new Error('Value is required');
        }

        const hash = bcrypt.hashSync(value, saltRounds);
        resolve(hash);
      } catch (e) {
        reject(e);
      }
    });
  },

  compareHash: (value: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        if (!value || !hash) {
          throw new Error('Value and hash are required');
        }

        const result = bcrypt.compareSync(value, hash);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  },

  healthCheck: async (): Promise<void> => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      throw new Error(`Health check failed: ${e.message}`);
    }
  },

  getTokenFromHeader: (
    authorizationHeader: string | undefined,
  ): string | null => {
    if (!authorizationHeader) return null;
    const token = authorizationHeader.replace('Bearer ', '');
    return token || null;
  },

  verifyToken: (token: string): any => {
    try {
      return JWT.verify(token, process.env.APP_JWT_SECRET as string);
    } catch (err) {
      return null;
    }
  },

  validateSchema: (schema: Joi.ObjectSchema) => {
    return (data: any) => {
      const { error } = schema.validate(data);
      if (error) {
        throw new Error(error.details[0].message);
      }
    };
  },

  preValidation: (schema: Joi.ObjectSchema) => {
    return (
      request,
      reply,
      done: (err?: Error) => void,
    ) => {
      const { error } = schema.validate(request.body);
      if (error) {
        return done(error);
      }
      done();
    };
  },
};
