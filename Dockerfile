FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG STORIES_URL=https://aconymous.com/api/stories/antislopdev
ADD ${STORIES_URL} site/stories.json
RUN npm run site

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site/dist/ /usr/share/nginx/html/
EXPOSE 80
