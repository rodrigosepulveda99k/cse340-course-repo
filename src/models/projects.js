import { pool } from './db.js';

/**
 * Get all projects from the database
 * Criteria: Fetches dynamic data for the projects page
 */
export async function getAllProjects() {
    try {
        const sql = "SELECT * FROM project ORDER BY project_name ASC";
        const result = await pool.query(sql);
        
        console.log(`Executed query: { text: '${sql}', rows: ${result.rowCount} }`);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
}

/**
 * Get the next N upcoming projects
 * Criteria: Filters by date >= current date and joins with organization table
 */
export async function getUpcomingProjects(number_of_projects) {
    try {
        const sql = `
            SELECT 
                p.project_id, 
                p.project_name AS title, 
                p.description, 
                p.date, 
                p.location, 
                p.organization_id, 
                o.name AS organization_name
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            WHERE p.date >= CURRENT_DATE
            ORDER BY p.date ASC
            LIMIT $1`;
        
        const result = await pool.query(sql, [number_of_projects]);
        console.log(`Executed getUpcomingProjects: { rows: ${result.rowCount} }`);
        return result.rows;
    } catch (error) {
        console.error("Error in getUpcomingProjects model:", error);
        throw error;
    }
}

/**
 * Get details for a single project by its ID
 * Criteria: Joins with organization table to get the partner name
 */
export async function getProjectDetails(id) {
    try {
        const sql = `
            SELECT 
                p.project_id, 
                p.project_name AS title, 
                p.description, 
                p.date, 
                p.location, 
                p.organization_id, 
                o.name AS organization_name
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            WHERE p.project_id = $1`;
        
        const result = await pool.query(sql, [id]);
        return result.rows[0]; // Returns a single project object
    } catch (error) {
        console.error("Error in getProjectDetails model:", error);
        throw error;
    }
}