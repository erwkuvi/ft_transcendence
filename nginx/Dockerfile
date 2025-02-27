#FROM nginx:latest
#
#RUN apt-get update && apt-get install -y netcat-openbsd iputils-ping && apt-get clean
#
#COPY ./nginx.conf /etc/nginx/nginx.conf
#
#COPY ./certs /etc/nginx/certs

# COPY ./wait-for-react.sh /wait-for-react.sh

# RUN chmod +x /wait-for-react.sh

# ENTRYPOINT ["/bin/sh", "-c", "/wait-for-react.sh"]


#CMD ["nginx", "-g", "daemon off;"]

FROM nginx:stable-alpine

# Install necessary tools including envsubst
RUN apk update && apk add --no-cache gettext netcat-openbsd iputils

# Copy the template nginx.conf (will contain variables like ${NGINX_SERVER_NAME})
COPY ./nginx.conf /etc/nginx/nginx.template

# Copy SSL certificates
COPY ./certs /etc/nginx/certs

# Replace environment variables and start NGINX
#CMD envsubst '$NGINX_SERVER_NAME' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g "daemon off;"
# Replace environment variables and start NGINX using a writable config location
CMD envsubst '$NGINX_SERVER_NAME' < /etc/nginx/nginx.template > /tmp/nginx.conf && nginx -c /tmp/nginx.conf -g "daemon off;"


