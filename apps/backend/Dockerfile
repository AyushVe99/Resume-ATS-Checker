FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 && npm config set fetch-retry-mintimeout 100000 && npm install --network-timeout=1000000

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
