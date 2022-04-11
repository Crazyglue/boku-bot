# Stage 1
FROM node:17-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

ADD . /usr/app
RUN npm run build
CMD ["npm", "start"]


# RUN npm config set unsafe-perm true
# RUN npm install -g typescript
# RUN npm install -g ts-node
# USER node
# RUN npm install
# COPY --chown=node:node . .
# RUN npm run build

# # Stage 2
# FROM node:17-alpine
# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
# WORKDIR /home/node/app
# COPY package*.json ./
# USER node
# # RUN npm install --save-dev sequelize-cli
# RUN npm install --production
# COPY --from=builder /home/node/app/built ./built

# COPY --chown=node:node .env .
# # COPY --chown=node:node .sequelizerc .
# # COPY --chown=node:node  /config ./config
# # COPY --chown=node:node  /public ./public

# EXPOSE 3000

# CMD [ "node", "built/index.js" ]
