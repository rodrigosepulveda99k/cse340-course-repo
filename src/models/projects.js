import pool from './db.js';

/**
 * Get all projects from the database
 * Criteria 2: Fetches dynamic data for the projects page
 */
export async function getAllProjects() {
    try {
        const sql = "SELECT * FROM project ORDER BY project_name ASC";
        const result = await pool.query(sql);
        
        // Log para que veas en la consola que la query se ejecutó (como en tu captura)
        console.log(`Executed query: { text: '${sql}', rows: ${result.rowCount} }`);
        
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
}