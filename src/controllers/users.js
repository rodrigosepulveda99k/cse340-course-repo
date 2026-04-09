import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

/* --- MIDDLEWARES --- */

export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        // Forzamos el guardado de la sesión antes de redirigir
        return req.session.save(() => res.redirect('/login'));
    }
    next();
};

export const requireAdmin = (req, res, next) => {
    const user = req.session.user;
    if (!user || user.role_name !== 'Admin') {
        req.flash('error', 'Access denied. Administrator permissions required.');
        return req.session.save(() => res.redirect('/dashboard'));
    }
    next();
};

/* --- REGISTRO --- */

export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // --- LÓGICA PARA EL APELLIDO ---
        // Limpiamos espacios y dividimos el nombre completo
        const nameParts = name.trim().split(/\s+/); 
        const firstName = nameParts[0]; // El primer nombre
        
        // Si puso más de una palabra, el resto es el apellido. 
        // Si puso solo una, mandamos "None" o un punto para cumplir con el NOT NULL.
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'None';

        // Enviamos los 4 parámetros al modelo corregido
        await createUser(firstName, email, passwordHash, lastName);
        
        req.flash('success', 'Registration successful! Please log in.');
        req.session.save(() => res.redirect('/login'));
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration.');
        req.session.save(() => res.redirect('/register'));
    }
};
/* --- LOGIN --- */

export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            req.session.save(() => res.redirect('/dashboard'));
        } else {
            req.flash('error', 'Invalid email or password.');
            req.session.save(() => res.redirect('/login'));
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Connection error during login.');
        req.session.save(() => res.redirect('/login'));
    }
};

/* --- DASHBOARD --- */

export const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'User Dashboard',
        user: user,
        name: user.name,
        email: user.email
    });
};

/* --- LISTADO DE USUARIOS (ADMIN ONLY) --- */

export const showUserList = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('user-list', { 
            title: 'Registered Users', 
            users 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'Could not retrieve user list.');
        req.session.save(() => res.redirect('/dashboard'));
    }
};

/* --- LOGOUT --- */

export const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Error destroying session:', err);
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
};