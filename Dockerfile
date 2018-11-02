FROM node:8.12

WORKDIR /usr/src/jcatch

COPY package.json ./

RUN npm install

ENV MONGO_INITDB_ROOT_USERNAME admin-user
ENV MONGO_INITDB_ROOT_PASSWORD admin-password
ENV MONGO_INITDB_DATABASE jcatch


COPY . .

EXPOSE 80

CMD ["npm", "start"]
