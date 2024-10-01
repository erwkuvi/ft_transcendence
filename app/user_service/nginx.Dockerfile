FROM nginx:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache openssl gettext

RUN mkdir -p /etc/nginx/certs
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/certs/cert.key \
	-out /etc/nginx/certs/cert.crt \
	-subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
	

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]