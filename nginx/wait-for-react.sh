#!/bin/sh
echo "Waiting for React to be available.........."
while ! nc -z frontend 8081; do
  sleep 2
done
echo "React is up!"
exec nginx -g 'daemon off;'

