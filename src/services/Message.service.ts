import { type Message } from "@prisma/client";
import { AppError, ERRORS } from "../helpers/errors.helper";
import { IRawMessageResponse } from "../schemas/Message";
import { prisma } from "../utils";

export class MessageService {
    async send(authorId: string, content: string, mimetype: string): Promise<Message> {
        return await prisma.message.create({
            data: {
                content,
                created_by: {
                    connect: {
                        id: authorId,
                    },
                },
                mimetype,
            },
        });
    }

    async getMessages(pageSize: number, offset: number): Promise<Message[]> {
        return await prisma.message.findMany({
            take: pageSize,
            skip: offset,
        });
    }

    async getRawMessage(id: string): Promise<IRawMessageResponse> {
        const message = await prisma.message.findUnique({
            where: {
                id,
            },
        });

        if (!message) {
            throw new AppError(ERRORS.messageNotFound.message, ERRORS.messageNotFound.statusCode);
        }

        return {
            'Content-Type': message.mimetype,
            content: message.content,
        };
    }
}

export const messageService = new MessageService();