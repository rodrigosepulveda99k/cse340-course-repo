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

// 2. CONFIGURACIÓN DE SESIÓN (Agregado aquí)
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hora
}));

// 3. CONFIGURACIÓN DE FLASH (Agregado aquí - Debe ir después de session)
app.use(flash);

// 4. CONFIGURACIÓN DE VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 5. MIDDLEWARES DE LOGS Y LOCALES
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

// 6. RUTAS (Siempre después de session y flash)
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