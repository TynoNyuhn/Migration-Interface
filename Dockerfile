FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install react-scripts@5.0.0 -g --silent
RUN npm ci --silent
ARG REACT_APP_GKE_IP
ENV REACT_APP_GKE_IP 34.171.128.48
RUN echo "${REACT_APP_GKE_IP}"
ARG REACT_APP_AKS_IP
ENV REACT_APP_AKS_IP 20.121.139.124
RUN echo "${REACT_APP_AKS_IP}"

COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
# ENV REACT_APP_GKE_IP 34.173.162.99
# ENV REACT_APP_AKS_IP 20.121.139.124
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# CMD envsubst < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js  \ 
#     && nginx -g 'daemon off;'
CMD ["nginx", "-g", "daemon off;"]

