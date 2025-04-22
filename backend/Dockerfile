# Dockerfile cho backend NestJS
FROM node:16

# Tạo thư mục app và set làm working directory
WORKDIR /usr/src/app

# Copy package.json và cài đặt các dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn của backend vào container
COPY . .

# Build ứng dụng NestJS
RUN npm run build

# Mở port mà backend sẽ chạy
EXPOSE 3000

# Chạy backend NestJS
CMD ["npm", "run", "start:prod"]
