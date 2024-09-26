# Use the official Python image with Alpine
FROM python:3.9-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies required for building Python packages and database libraries
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    libffi-dev \
    openssl-dev \
    pkgconfig \
    linux-headers \
    build-base \
    && apk del build-base

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY ./requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /code/

# Expose the port the app runs on
EXPOSE 8000

# Ensure the script has executable permissions
RUN chmod +x script.sh

# Command to run the script
CMD ["./script.sh"]
