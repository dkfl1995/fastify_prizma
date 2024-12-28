import { FastifyInstance } from 'fastify';
import * as controllers from '../controllers';
import { utils } from '../utils';
import { loginSchema, registerSchema } from '../schemas/User';

async function userRouter(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    {
      schema: {
        body: loginSchema,
      },
      config: {
        description: 'User login endpoint',
      },
      preValidation: [utils.preValidation(loginSchema)],
    },
    controllers.login,
  );

  fastify.post(
    '/register',
    {
      schema: {
        body: registerSchema,
      },
      config: {
        description: 'User signup endpoint',
      },
      preValidation: [utils.preValidation(registerSchema)],
    },
    controllers.register,
  );
}

export default userRouter;
