import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { handleServerError } from '../helpers/errors.helper';
import { STANDARD } from '../constants/request';
import { IUserLoginDto, IUserSignupDto } from '../schemas/User';
import { userService } from '../services/User.service';

export const login: RouteHandlerMethod = async (
  request: FastifyRequest<{
    Body: IUserLoginDto;
  }>,
  reply,
) => {
  try {
    const { username, password } = request.body;
    const res = await userService.login(username, password);

    return reply.code(STANDARD.OK.statusCode).send(res);
  } catch (err) {
    return handleServerError(reply as unknown as FastifyReply, err);
  }
};

export const register: RouteHandlerMethod = async (
  request: FastifyRequest<{
    Body: IUserSignupDto;
  }>,
  reply
) => {
  try {
    const { email, password, username } = request.body;

    const res = await userService.register(email, password, username);

    return reply.code(STANDARD.OK.statusCode).send(res);
  } catch (err) {
    return handleServerError(reply as unknown as FastifyReply, err);
  }
};
