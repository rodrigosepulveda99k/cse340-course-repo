import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { getProjectsByUser } from '../models/volunteers.js';
import { body, validationResult } from 'express-validator';

/* --- MIDDLEWARES --- */

export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
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

export const registrationValidation = [
    body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
    body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
];

export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register', errors: null });
};

export const processUserRegistrationForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { title: 'Register', errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'None';

        const result = await createUser(firstName, email, passwordHash, lastName);

        if (result) {
            req.flash('success', 'Registration successful! Please log in.');
            return req.session.save(() => res.redirect('/login'));
        } else {
            throw new Error('Database did not return an ID');
        }
    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        req.flash('error', 'An error occurred. The email might already be registered.');
        return req.session.save(() => res.redirect('/register'));
    }
};

/* --- LOGIN (CON DEPURACIÓN) --- */

export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return req.session.save(() => res.redirect('/login'));
        }
        req.session.user = user;
        return req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).send('Session error');
            }
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return req.session.save(() => res.redirect('/login'));
    }
};

/* --- DASHBOARD --- */

export const showDashboard = async (req, res) => {
    const user = req.session.user;
    try {
        const signedUpProjects = await getProjectsByUser(user.account_id);
        res.render('dashboard', {
            title: 'User Dashboard',
            user: user,
            isLoggedIn: true,
            name: user ? user.name : 'Guest',
            email: user ? user.email : '',
            signedUpProjects
        });
    } catch (error) {
        console.error('Error fetching volunteered projects:', error);
        res.render('dashboard', {
            title: 'User Dashboard',
            user: user,
            isLoggedIn: true,
            name: user ? user.name : 'Guest',
            email: user ? user.email : '',
            signedUpProjects: []
        });
    }
};

/* --- LISTADO DE USUARIOS (Admin Only) --- */

export const showUserList = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('user-list', { 
            title: 'Registered Users', 
            users,
            user: req.session.user,
            isLoggedIn: true
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