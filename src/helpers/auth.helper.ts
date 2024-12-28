import { utils } from '../utils';
import { FastifyRequest, FastifyReply, preValidationAsyncHookHandler } from 'fastify';
import { prisma } from '../utils';
import { ERRORS } from './errors.helper';

export const checkValidRequest = (
  request: FastifyRequest,
  reply: FastifyReply,
  next: () => void,
) => {
  const token = utils.getTokenFromHeader(request.headers.authorization);
  if (!token) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  const decoded = utils.verifyToken(token);
  if (!decoded) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }
  next();
};

export const checkValidUser = async (
  request,
  reply,
) => {
  const token = utils.getTokenFromHeader(request.headers.authorization);
  if (!token) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  const decoded = utils.verifyToken(token);
  if (!decoded || !decoded.id) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!userData) {
      return reply
        .code(ERRORS.unauthorizedAccess.statusCode)
        .send(ERRORS.unauthorizedAccess.message);
    }

    request['authUser'] = userData;
  } catch (e) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }
};
