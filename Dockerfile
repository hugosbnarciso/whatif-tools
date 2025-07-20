# Use an official PHP image with the Apache web server
FROM php:8.3-apache

# Set the working directory to the web server's root
WORKDIR /var/www/html

# Copy your application code into the container
COPY . .

# Ensure the web server has permission to access the files
RUN chown -R www-data:www-data /var/www/html