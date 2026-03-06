#!/bin/bash
# 9 件小事 H5 - 华为云服务器部署脚本
# 使用方法：在服务器上执行 bash deploy.sh

set -e

echo "🚀 开始部署 9 件小事 H5..."

# 1. 检查 Node.js
echo "📦 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，正在安装..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
node -v
npm -v

# 2. 检查 Nginx
echo "🌐 检查 Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx 未安装，正在安装..."
    apt-get update
    apt-get install -y nginx
fi

# 3. 克隆或更新代码
echo "📥 获取代码..."
cd /var/www
if [ -d "9-small-things-h5" ]; then
    echo "📁 项目已存在，更新代码..."
    cd 9-small-things-h5
    git pull
else
    echo "📁 首次部署，克隆代码..."
    git clone https://github.com/laijnking/9-small-things-h5.git
    cd 9-small-things-h5
fi

# 4. 安装依赖并构建
echo "🔨 安装依赖并构建..."
npm install
npm run build

# 5. 配置 Nginx
echo "⚙️ 配置 Nginx..."
cat > /etc/nginx/sites-available/9-small-things << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /var/www/9-small-things-h5/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/9-small-things /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 6. 配置防火墙
echo "🔥 配置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp || true
    ufw reload || true
fi

# 7. 完成
echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址：http://$(curl -s ifconfig.me)"
echo ""
echo "📋 常用命令："
echo "  查看日志：tail -f /var/log/nginx/access.log"
echo "  重启 Nginx：systemctl restart nginx"
echo "  更新代码：cd /var/www/9-small-things-h5 && git pull && npm install && npm run build"
echo ""
