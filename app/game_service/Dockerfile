# Use Alpine base image
FROM python:3.9-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install necessary build dependencies and python libraries
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    libffi-dev \
    pkgconfig \
    linux-headers \
    build-base \
    && apk del build-base

# Copy the requirements file into the container
COPY ./requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the working directory and copy the application code
WORKDIR /code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

RUN chmod +x script.sh

# Run the start-up script
CMD ["./script.sh"]
