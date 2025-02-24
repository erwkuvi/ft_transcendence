FROM nginx:latest

RUN apt-get update && apt-get install -y netcat-openbsd iputils-ping && apt-get clean

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./certs /etc/nginx/certs

# COPY ./wait-for-react.sh /wait-for-react.sh

# RUN chmod +x /wait-for-react.sh

# ENTRYPOINT ["/bin/sh", "-c", "/wait-for-react.sh"]


CMD ["nginx", "-g", "daemon off;"]


