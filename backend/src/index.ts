import app from './app';

const PORT = 3000; // 强制使用3000端口

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
}); 