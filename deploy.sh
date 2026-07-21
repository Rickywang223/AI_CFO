#!/bin/bash
# AI CFO Deployment Script
# Usage: ./deploy.sh <server_ip> <password>

SERVER="${1:-172.25.17.4}"
PASS="${2:-NISECTC5002}"
PORT="5002"

echo "🚀 AI CFO 部署脚本"
echo "目标服务器: $SERVER"
echo ""

# 1. 打包当前项目
echo "📦 打包项目..."
cd /home/rickyclaw/税安AI
mkdir -p /tmp/ai_cfo_deploy/templates /tmp/ai_cfo_deploy/static
cp app.py /tmp/ai_cfo_deploy/
cp templates/demo.html /tmp/ai_cfo_deploy/templates/
[ -f static/logo.png ] && cp static/logo.png /tmp/ai_cfo_deploy/static/
cat > /tmp/ai_cfo_deploy/requirements.txt << 'EOF'
flask
EOF
cat > /tmp/ai_cfo_deploy/start.sh << 'SCRIPT'
#!/bin/bash
cd "$(dirname "$0")"
echo "=== AI CFO Demo Starting ==="
pip3 install -q flask 2>/dev/null || pip install -q flask
python3 app.py
SCRIPT
chmod +x /tmp/ai_cfo_deploy/start.sh
cd /tmp && tar -czf ai_cfo_deploy.tar.gz ai_cfo_deploy/
echo "✅ 打包完成: $(du -h ai_cfo_deploy.tar.gz | cut -f1)"

# 2. 上传到服务器
echo "📤 上传到服务器..."
# Use expect-like approach with process substitution
SSHPASS="$PASS" sshpass -p "$PASS" scp -o StrictHostKeyChecking=no ai_cfo_deploy.tar.gz root@$SERVER:/root/
if [ $? -ne 0 ]; then
    # Fallback: use Python
    python3 -c "
import subprocess, sys
p = subprocess.Popen(['scp', '-o', 'StrictHostKeyChecking=no', 
    '/tmp/ai_cfo_deploy.tar.gz', 
    'root@$SERVER:/root/'],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
o, e = p.communicate(input=b'$PASS\n', timeout=30)
print(o.decode(), e.decode())
"
fi
echo "✅ 上传完成"

# 3. 远程安装并启动
echo "🔧 在服务器上解压并启动..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no root@$SERVER "
    cd /root &&
    tar -xzf ai_cfo_deploy.tar.gz &&
    cd ai_cfo_deploy &&
    pip3 install -q -r requirements.txt 2>/dev/null || pip install -q -r requirements.txt &&
    echo '✅ 依赖安装完成'
"

echo "✅ 部署完成!"
echo "访问地址: http://$SERVER:$PORT"
