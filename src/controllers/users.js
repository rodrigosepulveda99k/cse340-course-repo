import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

/* --- MIDDLEWARES DE PROTECCIÓN Y AUTORIZACIÓN --- */

// Verifica si el usuario está logueado
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        if (req.flash) req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Requerimiento de la Tarea: Restringir acceso solo a Admins.
 * Verifica que el usuario tenga el rol de administrador.
 */
export const requireAdmin = (req, res, next) => {
    const user = req.session.user;
    // Comprobamos si el rol es 'admin' o si el ID de rol corresponde al administrador (ej. 1)
    if (!user || (user.role_name !== 'admin' && user.role_id !== 1)) {
        if (req.flash) req.flash('error', 'Access denied. Administrator permissions required.');
        return res.redirect('/dashboard');
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
        await createUser(name, email, passwordHash);
        if (req.flash) req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        if (req.flash) req.flash('error', 'An error occurred during registration.');
        res.redirect('/register');
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
            if (req.flash) req.flash('success', 'Login successful!');
            res.redirect('/dashboard');
        } else {
            if (req.flash) req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('/login');
    }
};

/* --- DASHBOARD --- */

export const showDashboard = (req, res) => {
    // Pasamos el objeto user completo para que la vista dashboard.ejs 
    // pueda decidir si mostrar el link de "Admin" o no.
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'User Dashboard',
        user: user,
        name: user.name,
        email: user.email
    });
};

/* --- LISTADO DE USUARIOS (ADMIN ONLY) --- */

/**
 * Requerimiento de la Tarea: Obtener todos los usuarios y mostrarlos.
 */
export const showUserList = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('user-list', { 
            title: 'Registered Users', 
            users 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        if (req.flash) req.flash('error', 'Could not retrieve user list.');
        res.redirect('/dashboard');
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