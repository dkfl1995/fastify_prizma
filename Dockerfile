FROM node:20-alpine

WORKDIR /app

RUN apk update \
	&& apk add --no-cache openssl


COPY . .

RUN npm install

RUN npm run db:gen

EXPOSE 5001

CMD npx prisma migrate deploy && npm run dev