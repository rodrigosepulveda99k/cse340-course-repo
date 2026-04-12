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

// 2. CONFIGURACIÓN DE SESIÓN (CORREGIDA)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false, // Cambiado a false para mejor gestión de memoria
    cookie: { 
        maxAge: 60 * 60 * 1000, // 1 hora
        secure: false,          // IMPORTANTE: Ponelo en false para que funcione en Render sin líos de SSL
        httpOnly: true          // Protege contra ataques XSS
    }
}));

// 3. CONFIGURACIÓN DE FLASH
app.use(flash);

// 4. CONFIGURACIÓN DE VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 5. MIDDLEWARE DE VARIABLES LOCALES
app.use((req, res, next) => {
    // Definimos isLoggedIn y user de forma robusta
    res.locals.isLoggedIn = !!(req.session && req.session.user);
    res.locals.user = req.session.user || null;

    // Manejo de mensajes flash
    if (req.session.flash) {
        res.locals.messages = req.session.flash;
        delete req.session.flash;
    } else {
        res.locals.messages = {};
    }

    // Función auxiliar para el header.ejs (por si el header la llama)
    res.locals.getMessages = () => {
        const msgs = res.locals.messages;
        res.locals.messages = {}; // Limpia después de leer
        return msgs;
    };

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