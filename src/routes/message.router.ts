import { FastifyInstance, FastifyRequest, } from 'fastify';
import * as controllers from '../controllers';
import { checkValidUser } from '../helpers/auth.helper';
import { messageCreateSchema } from '../schemas/Message';
import { paginationSchema } from '../schemas/Pagination';

async function messageRouter(fastify: FastifyInstance) {
    fastify.get(
        '/content/:id',
        {
            preValidation: [checkValidUser],
        },
        controllers.getRawMessage,
    );

    fastify.post(
        '/text',
        {
            schema: {
                body: messageCreateSchema,
            },
            preValidation: [checkValidUser],
        },
        controllers.sendMessage,
    );
    
    fastify.post(
        '/file',
        {
            preValidation: [checkValidUser],
        },
        controllers.uploadAttachment,
    );

    fastify.get(
        '/list',
        {
            schema: {
                querystring: paginationSchema,
            },
            preValidation: [checkValidUser],
        },
        controllers.getMessages,
    );
}

export default messageRouter;
