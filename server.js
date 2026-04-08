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

// 1. MIDDLEWARES ESTÁTICOS Y DE PARSEO
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CONFIGURACIÓN DE SESIÓN
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Tip: usa dotenv para el secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hora
}));

// 3. CONFIGURACIÓN DE FLASH (Debe ir después de session)
app.use(flash);

// 4. CONFIGURACIÓN DE VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 5. MIDDLEWARE DE LOGS Y VARIABLES LOCALES (UNIFICADO)
app.use((req, res, next) => {
    // Log de peticiones en desarrollo
    if (nodeEnv === 'development') {
        console.log(`${req.method} ${req.url}`);
    }

    // --- VARIABLES PARA LAS VISTAS ---
    res.locals.isLoggedIn = false;
    res.locals.user = null;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user; 
    }

    res.locals.NODE_ENV = nodeEnv;
    res.locals.nodeEnv = nodeEnv;
    
    next();
});

// 6. RUTAS (Siempre después de session, flash y locals)
app.use(routes);

// 7. INICIO DEL SERVIDOR
app.listen(port, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${port}`);
        console.log(`Environment: ${nodeEnv}`);
    } catch (error) {
        console.error('Error connecting to the database on startup:', error.message);
    }
});