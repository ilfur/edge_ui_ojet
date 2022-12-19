FROM nginx:alpine AS base-nginx-container

# Remove the default nginx config
RUN rm -v /etc/nginx/nginx.conf

# Create the folder structure to form the URI Path
RUN mkdir -p /html/edge/ui

# Update folder permissions, especially important if you're running inside RedHat OpenShit
RUN chmod -R a+rwx /usr/share

# Expose specific port
EXPOSE 8080

# Copy my nginx Config
COPY nginx.conf /etc/nginx/

# Copy the Source Code
COPY web /html/edge/ui

# Copy over the package.json - This is personal preference if you wish to have the json metadata in your final application
COPY package.json /html/ui

# Start nginx service
CMD ["nginx","-g","daemon off;"]

