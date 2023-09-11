FROM node:19.8.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the built Next.js app from the host machine to the container
COPY . .

# Build the app
CMD ["npm", "start"]
