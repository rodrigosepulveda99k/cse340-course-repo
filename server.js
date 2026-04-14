import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './src/controllers/routes.js';
import session from 'express-session'; 
import flash from './src/middleware/flash.js'; 

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (e.g. Render) so secure cookies work behind HTTPS termination
app.set('trust proxy', 1);

// 1. MIDDLEWARES ESTÁTICOS Y DE PARSEO
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CONFIGURACIÓN DE SESIÓN
if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));

// 3. CONFIGURACIÓN DE FLASH
app.use(flash);

// 4. CONFIGURACIÓN DE VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 5. MIDDLEWARE DE VARIABLES LOCALES
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!(req.session && req.session.user);
    res.locals.user = req.session.user || null;
    res.locals.NODE_ENV = nodeEnv;
    next();
});

// 6. RUTAS
app.use(routes);

// 7. INICIO DEL SERVIDOR
app.listen(port, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${port}`);
    } catch (error) {
        console.error('Error connecting to the database on startup:', error.message);
    }
});