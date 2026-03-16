import { pool } from './db.js';

/**
 * Fetches all categories from the database.
 */
const getAllCategories = async () => {
    const query = 'SELECT category_id, category_name FROM category ORDER BY category_name ASC';
    try {
        // CORRECCIÓN: Cambiado 'db.query' por 'pool.query'
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export { getAllCategories };