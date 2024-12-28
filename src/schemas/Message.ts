import Joi from 'joi';

export interface IMessageCreateDto {
  content: string;
}

export interface IGetRawMessageParams { 
  id: string;
}

export interface IRawMessageResponse {
  'Content-Type': string;
  content?: string;
}

export const messageCreateSchema = Joi.object({
  content: Joi.string().required(),
});
