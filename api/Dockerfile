FROM node

WORKDIR /project

COPY ./project/package*.json /project
RUN npm i

CMD ["npm", "run", "dev"]
