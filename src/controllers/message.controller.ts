import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { handleServerError } from '../helpers/errors.helper';
import { STANDARD } from '../constants/request';
import { IGetRawMessageParams, IMessageCreateDto } from '../schemas/Message';
import fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { messageService } from '../services/Message.service';

const pump = promisify(pipeline);

export const sendMessage: RouteHandlerMethod = async (
  request: FastifyRequest<{
    Body: IMessageCreateDto;
  }>,
  reply
) => {
  try {
    const { id } = request['authUser'];
    const { content } = request.body;
    const res = await messageService.send(id, content, 'text/plain');
    reply.status(STANDARD.OK.statusCode).send({ data: res });
  } catch (e) {
    handleServerError(reply as unknown as FastifyReply, e);
  }
};

// Method to upload attachment file to the server.
// Binary data will be saved in the server folder.
export const uploadAttachment: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply
) => {
    try {
        const { id } = request['authUser'];
        const multipart = await request.file();
        const { filename, file, mimetype } = multipart;
        const path = `./uploads/${filename}`;
        await pump(file, fs.createWriteStream(path));
        const res = await messageService.send(id, path, mimetype);
        
        reply.status(STANDARD.OK.statusCode).send({ data: res });
    } catch (e) {
        handleServerError(reply as unknown as FastifyReply, e);
    }
}

export const getMessages: RouteHandlerMethod = async (
    request: FastifyRequest<{
        Querystring: {
            pagesize: string;
            offset: string;
        };
    }>,
    reply
) => {
    try {
        const { pagesize, offset } = request.query;
        const posts = await messageService.getMessages(parseInt(pagesize), parseInt(offset));
        reply.status(STANDARD.OK.statusCode).send({ data: posts });
    } catch (e) {
        handleServerError(reply as unknown as FastifyReply, e);
    }
}

export const getRawMessage: RouteHandlerMethod = async (
    request: FastifyRequest<{
        Params: IGetRawMessageParams;
    }>,
    reply
) => {
    try {
        const { id } = request.params;
        const message = await messageService.getRawMessage(id);

        if (message['Content-Type'] === 'text/plain') {
            return reply.status(STANDARD.OK.statusCode).type(message['Content-Type']).send(message.content);
        } else {
            const file = fs.createReadStream(message.content);
            return reply.status(STANDARD.OK.statusCode).type(message['Content-Type']).send(file);
        }
    } catch (e) {
        handleServerError(reply as unknown as FastifyReply, e);
    }
}
