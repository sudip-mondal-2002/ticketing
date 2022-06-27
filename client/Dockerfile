FROM node:16-alpine

WORKDIR /app
COPY . .
RUN npm install --omit=dev

CMD ["npm", "run", "dev"]