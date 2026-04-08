import { pool as db } from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserta un nuevo usuario en la base de datos asignándole el rol 'user' por defecto.
 */
export const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const query_params = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

/**
 * Busca un usuario por su email incluyendo el nombre del rol.
 * Se actualizó con un JOIN para obtener role_name, necesario para la autorización.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

/**
 * Compara la contraseña en texto plano con el hash almacenado.
 */
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

/**
 * Autentica al usuario y devuelve sus datos (incluyendo role_name y sin el hash).
 */
export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordCorrect = await verifyPassword(password, user.password_hash);

    if (isPasswordCorrect) {
        // Extraemos password_hash para no enviarlo a la sesión por seguridad
        const { password_hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    return null;
};

/**
 * Obtiene la lista de todos los usuarios registrados con sus respectivos roles.
 * REQUERIMIENTO DEL ASSIGNMENT: Solo para uso del Administrador.
 */
export const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;
    const result = await db.query(query);
    return result.rows;
};