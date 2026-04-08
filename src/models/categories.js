import { pool } from './db.js';

export const getAllCategories = async () => {
    const query = 'SELECT category_id, category_name FROM category ORDER BY category_name ASC';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryById = async (id) => {
    const sql = 'SELECT * FROM category WHERE category_id = $1';
    const result = await pool.query(sql, [id]);
    return result.rows[0];
};

export const getCategoriesByProject = async (projectId) => {
    const sql = `
        SELECT c.* FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1`;
    const result = await pool.query(sql, [projectId]);
    return result.rows;
};

export const createCategory = async (category_name) => {
    try {
        const sql = 'INSERT INTO category (category_name) VALUES ($1) RETURNING *';
        return await pool.query(sql, [category_name]);
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (category_id, category_name) => {
    try {
        const sql = 'UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *';
        return await pool.query(sql, [category_name, category_id]);
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const getProjectsByCategory = async (categoryId) => {
    const sql = `
        SELECT p.* FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_name ASC`;
    try {
        const result = await pool.query(sql, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
    }
};
// Esta queda interna (sin export)
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    // Usamos 'pool' que es como lo tenés definido arriba
    await pool.query(query, [categoryId, projectId]);
};

// Esta se exporta para el controlador
export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await pool.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};