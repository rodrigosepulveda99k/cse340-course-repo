import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

/* --- MIDDLEWARE DE PROTECCIÓN --- */

/**
 * Verifica si el usuario tiene una sesión activa antes de permitir el acceso.
 * Como QA, esto asegura que las rutas privadas no sean accesibles vía URL directa.
 */
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        if (req.flash) req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    // Si el usuario existe, pasamos al siguiente middleware o controlador
    next();
};

/* --- REGISTRO --- */

// Muestra el formulario de registro
export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Procesa los datos del formulario de registro
export const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        if (req.flash) req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        if (req.flash) req.flash('error', 'An error occurred during registration. Maybe the email is taken?');
        res.redirect('/register');
    }
};

/* --- LOGIN --- */

// Muestra el formulario de inicio de sesión
export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Valida credenciales e inicia la sesión del usuario
export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            // Guardamos el objeto usuario en la sesión (sin el password_hash)
            req.session.user = user;
            
            if (req.flash) req.flash('success', 'Login successful!');

            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in session:', user);
            }

            // Redirección al Dashboard tras éxito (Requerimiento Semana 05)
            res.redirect('/dashboard');
        } else {
            if (req.flash) req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        if (req.flash) req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};

/* --- DASHBOARD --- */

/**
 * Renderiza la vista del Dashboard con los datos del usuario en sesión.
 */
export const showDashboard = (req, res) => {
    // Al llegar aquí, requireLogin ya validó que req.session.user existe
    const { name, email } = req.session.user;
    
    res.render('dashboard', { 
        title: 'User Dashboard',
        name: name,
        email: email
    });
};

/* --- LOGOUT --- */

// Destruye la sesión y limpia la cookie del navegador
export const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // 'connect.sid' es el nombre por defecto de la cookie de express-session
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
};