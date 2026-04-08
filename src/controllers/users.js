import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

/* --- REGISTRO --- */

// Muestra el formulario de registro
export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Procesa el registro de un nuevo usuario
export const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        if (req.flash) req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login'); // Redirigimos al login para que estrene su cuenta
    } catch (error) {
        console.error('Error registering user:', error);
        if (req.flash) req.flash('error', 'An error occurred during registration. Maybe the email is taken?');
        res.redirect('/register');
    }
};

/* --- LOGIN --- */

// Muestra el formulario de login
export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Procesa el inicio de sesión
export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            // Guardamos el objeto usuario en la sesión (Paso crítico de QA)
            req.session.user = user;
            
            if (req.flash) req.flash('success', 'Login successful!');

            // Log de depuración para ver que el objeto no traiga el password_hash
            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/');
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

/* --- LOGOUT --- */

// Cierra la sesión del usuario
export const processLogout = (req, res) => {
    // Destruye la sesión en el servidor
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Limpiamos la cookie del cliente y redirigimos
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
};