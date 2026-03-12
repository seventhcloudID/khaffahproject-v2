# Use a specific, recent version of Alpine Linux as the base image for stability.
FROM alpine:3.20

# Use the Alpine package manager (apk) to install Node.js and npm.
# --no-cache: This option downloads the package index, uses it to install the packages,
# and then discards the index. This helps to keep the image size small.
RUN apk add --no-cache nodejs npm

# Create a working directory for your application inside the container.
# This is where your application code will live.
WORKDIR /app

# You can add more instructions below this line. For example:
# 1. Copy your package.json and package-lock.json
COPY package*.json ./
#
# 2. Install your application's dependencies
RUN npm install
#
# 3. Copy your application source code
COPY . .
#
# 4. Expose the port your app runs on
# EXPOSE 3000
#
# 5. Define the command to run your application
RUN npm run build

CMD ["npm", "start"]
