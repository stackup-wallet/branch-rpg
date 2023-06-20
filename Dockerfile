FROM node:14 as build
WORKDIR /build
ADD . /build
RUN npm i
ARG NODE_RPC_URL
ARG PAYMASTER_RPC_URL
ENV NODE_ENV=production
RUN npm run build

FROM node:14-alpine
WORKDIR /game
COPY --from=build /build/dist ./
COPY --from=build /build/package*.json ./
ENV NODE_ENV=production
RUN npm i
EXPOSE 3000
CMD node server