import { pool as db } from './db.js';
import bcrypt from 'bcrypt';
import * as volunteerModel from '../models/volunteers.js';

/**
 * Inserta un nuevo usuario usando los nombres de columna reales detectados en la DB.
 */
export const createUser = async (name, email, passwordHash, lastname = 'Not Provided') => {
    const default_role = 'Client'; 
    const query = `
        INSERT INTO users (name, email, account_lastname, password_hash, role_name) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING account_id
    `;
    // Mapeo: $1:name, $2:email, $3:lastname, $4:passwordHash, $5:default_role
    const query_params = [name, email, lastname, passwordHash, default_role];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].account_id;
};

/**
 * Busca un usuario por email para el proceso de Login.
 */
export const findUserByEmail = async (email) => {
    const query = `
        SELECT account_id, name, account_lastname, email, password_hash, role_name 
        FROM users 
        WHERE email = $1
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

/**
 * Compara la contraseña usando password_hash de la DB.
 */
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

/**
 * Autentica al usuario y devuelve el objeto para la sesión (sin el hash).
 */
export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordCorrect = await verifyPassword(password, user.password_hash);

    if (isPasswordCorrect) {
        // Extraemos password_hash por seguridad para no guardarlo en la cookie de sesión
        const { password_hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    return null;
};

/**
 * Obtiene todos los usuarios (Requerimiento para vista de Admin).
 */
export const getAllUsers = async () => {
    const query = `
        SELECT account_id, name, account_lastname, email, role_name 
        FROM users 
        ORDER BY name ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

export async function showDashboard(req, res) {
    try {
        const userId = req.session.user.account_id;
        // Obtenemos la lista de proyectos del modelo de voluntarios
        const volunteerProjects = await volunteerModel.getProjectsByUser(userId);

        res.render('user/dashboard', { // Ajusta la ruta si tu dashboard está en otra carpeta
            title: 'Dashboard',
            user: req.session.user,
            volunteerProjects // Pasamos los proyectos a la vista
        });
    } catch (error) {
        console.error("Error en dashboard:", error);
        res.status(500).send("Error al cargar el dashboard");
    }
}