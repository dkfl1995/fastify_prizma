import Joi from "joi";

export const paginationSchema = Joi.object({
  offset: Joi.number().integer().min(0).default(0),
  pagesize: Joi.number().integer().min(1).default(10),
});