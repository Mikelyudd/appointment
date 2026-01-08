import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// 中间件
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// API 路由
app.use('/api', routes);

// 管理后台路由
app.use('/api/admin', adminRoutes);

// 错误处理
app.use(errorHandler);

export default app;
