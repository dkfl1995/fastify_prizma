import { FastifyInstance } from 'fastify';
import { UserController } from 'interface';
import { userControllers } from '../controllers';

export async function userRouter(fastify: FastifyInstance, opts, next) {
    let controllers: UserController = userControllers;

    fastify.post('/login', controllers.login)

    fastify.post('/signup', controllers.signUp)
}
