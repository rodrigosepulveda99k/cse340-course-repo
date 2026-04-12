import { pool as db } from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserta un nuevo usuario.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Email (único).
 * @param {string} passwordHash - Contraseña ya encriptada.
 * @param {string} account_lastname - Apellido (evita el NOT NULL error).
 */
export const createUser = async (name, email, passwordHash, account_lastname = 'None') => {
    const default_role = 'Client'; 
    const query = `
        INSERT INTO users (name, email, account_lastname, password_hash, role_name) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING account_id
    `;
    const query_params = [name, email, account_lastname, passwordHash, default_role];
    
    try {
        const result = await db.query(query, query_params);
        if (result.rows.length === 0) {
            throw new Error('Failed to create user: No rows returned');
        }
        return result.rows[0].account_id;
    } catch (error) {
        console.error("DATABASE ERROR in createUser:", error.message);
        throw error; // Re-lanzamos para que el controlador lo atrape
    }
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
    try {
        const result = await db.query(query, [email]);
        return result.rows.length === 0 ? null : result.rows[0];
    } catch (error) {
        console.error("DATABASE ERROR in findUserByEmail:", error.message);
        throw error;
    }
};

/**
 * Autentica al usuario y devuelve el objeto para la sesión (sin el hash).
 */
export const authenticateUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);

        if (!user) return null;

        // Compara la contraseña ingresada con el hash de la DB
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (isPasswordCorrect) {
            // Extraemos password_hash para que no viaje en la sesión por seguridad
            const { password_hash, ...userWithoutHash } = user;
            return userWithoutHash;
        }
        return null;
    } catch (error) {
        console.error("AUTHENTICATION ERROR:", error.message);
        throw error;
    }
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
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("DATABASE ERROR in getAllUsers:", error.message);
        throw error;
    }
};