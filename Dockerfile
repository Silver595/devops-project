FROM node:22-alpine

WORKDIR /app

# bcrypt requires native compilation tools
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8008

CMD ["node", "src/index.js"]
