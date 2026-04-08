import { pool } from './db.js';

export const getAllProjects = async () => {
    try {
        const sql = 'SELECT * FROM project ORDER BY project_name ASC';
        const result = await pool.query(sql);

        console.log(`Executed query: { text: '${sql}', rows: ${result.rowCount} }`);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllProjects model:', error);
        throw error;
    }
};

export const getUpcomingProjects = async (number_of_projects) => {
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
        console.error('Error in getUpcomingProjects model:', error);
        throw error;
    }
};

export const getProjectDetails = async (id) => {
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
        return result.rows[0];
    } catch (error) {
        console.error('Error in getProjectDetails model:', error);
        throw error;
    }
};

// Esta es la función clave para que la página de Categorías no esté "rota"
export const getProjectsByCategory = async (categoryId) => {
    try {
        const sql = `
            SELECT p.* FROM project p
            JOIN project_category pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.project_name ASC`;
        const result = await pool.query(sql, [categoryId]);
        console.log(`Executed getProjectsByCategory: { rows: ${result.rowCount} }`);
        return result.rows;
    } catch (error) {
        console.error('Error in getProjectsByCategory model:', error);
        throw error;
    }
};

export const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await pool.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};