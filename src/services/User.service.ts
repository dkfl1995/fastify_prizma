import { AppError, ERRORS } from "../helpers/errors.helper";
import { prisma, utils } from "../utils";
import * as JWT from 'jsonwebtoken';
import { Prisma } from "@prisma/client";

export class UserService {
    async register(email: string, password: string, username: string): Promise<{ token: string, user: Omit<Prisma.UserGetPayload<{}>, 'password'> }>{
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
            throw new AppError(ERRORS.userExists.message, ERRORS.userExists.statusCode);
        }

        const hashPass = await this.hashifyPassword(password);
        const createUser = await prisma.user.create({
            data: { 
                email,
                username,
                password: hashPass,
            },
            omit: { password: true },
        });

        const token = await this.generateToken(createUser);

        return { token, user: createUser };
    }

    async login(username: string, password: string): Promise<{ token: string, user: Omit<Prisma.UserGetPayload<{}>, 'password'> }> {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new AppError(ERRORS.userNotExists.message, ERRORS.userNotExists.statusCode);
        }

        // const hash = await this.hashifyPassword(password);
        const checkPass = await this.compareHashes(password, user.password);
        if (!checkPass) {
            throw new AppError(ERRORS.userCredError.message, ERRORS.userCredError.statusCode);
        }

        const token = await this.generateToken(user);
        return { token, user };
    }

    private async generateToken(user: Pick<Prisma.UserGetPayload<{}>, 'id' | 'username'>) {
        return JWT.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.APP_JWT_SECRET as string,
        );
    }

    private async hashifyPassword(password: string) {
        return await utils.genSalt(10, password);
    }

    private async compareHashes(password: string, hash: string) {
        return await utils.compareHash(password, hash);
    }
}

export const userService = new UserService();