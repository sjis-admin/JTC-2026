FROM nginx:1.25-alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom reverse proxy configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for static, media, certbot, and logs
RUN mkdir -p /app/staticfiles /app/media /var/www/certbot /etc/letsencrypt

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
