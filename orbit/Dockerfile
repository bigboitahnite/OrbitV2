FROM node:20-alpine

# Scramjet's libcurl transport needs native build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]
