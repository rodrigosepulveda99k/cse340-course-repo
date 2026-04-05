import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './src/controllers/routes.js';

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    if (nodeEnv === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.locals.NODE_ENV = nodeEnv;
    res.locals.nodeEnv = nodeEnv;
    next();
});

app.use(routes);

app.listen(port, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${port}`);
        console.log(`Environment: ${nodeEnv}`);
    } catch (error) {
        console.error('Error connecting to the database on startup:', error.message);
    }
});