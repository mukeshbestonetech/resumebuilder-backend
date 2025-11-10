const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// API Routes
const authRouter = require('./api/routes/auth.routes');
const userRouter = require('./api/routes/user.routes');
const resumeRouter = require('./api/routes/resume.routes');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get('/', (req, res) => {
    res.status(200).send('Server is healthy!');
});


module.exports = app;
