# Use the official Node.js 14 (LTS) as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the built Next.js app from the host machine to the container
COPY .next ./.next

# Expose the port that your Next.js app will run on
EXPOSE 3002

# Start the Next.js app
CMD ["npm", "start"]
