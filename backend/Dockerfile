# Sử dụng image node chính thức
FROM node:18-alpine

# Tạo và đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build mã nguồn
RUN npm run build

# Mở cổng cho ứng dụng
EXPOSE 3001

# Khởi chạy ứng dụng
CMD ["npm", "run", "start:prod"]