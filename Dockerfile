# Sử dụng Node.js phiên bản 20
FROM node:20-alpine 

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json & yarn.lock trước để cache dependencies
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile  

# Copy toàn bộ code
COPY . .

# Copy tsconfig.json (nếu cần)
COPY tsconfig.json .

# Build ứng dụng NestJS
RUN yarn build

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["yarn", "start:prod"]