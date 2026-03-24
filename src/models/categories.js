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

/**
 * Retrieve a single category by its ID
 */
export async function getCategoryById(id) {
    const sql = "SELECT * FROM category WHERE category_id = $1";
    const result = await pool.query(sql, [id]);
    return result.rows[0];
}

/**
 * Retrieve all categories associated with a specific service project
 */
export async function getCategoriesByProject(projectId) {
    const sql = `
        SELECT c.* FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1`;
    const result = await pool.query(sql, [projectId]);
    return result.rows;
}