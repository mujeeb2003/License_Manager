#!/bin/sh

# Replace API_URL in the built JavaScript files
find /usr/share/nginx/html -name '*.js' -exec sed -i 's,http://localhost:5000,http://backend:5000,g' {} +

# Start Nginx
exec "$@"