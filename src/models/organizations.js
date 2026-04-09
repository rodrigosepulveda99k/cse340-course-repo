import { pool } from './db.js';

export const getAllOrganizations = async () => {
    const query = 'SELECT organization_id, name, description, contact_email, logo_filename FROM organization ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
};

export const getOrganizationById = async (id) => {
    const query = 'SELECT organization_id, name, description, contact_email, logo_filename FROM organization WHERE organization_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createOrganization = async (name, description, contact_email, logo_filename) => {
    const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;
    const result = await pool.query(query, [name, description, contact_email, logo_filename]);
    return result.rows[0].organization_id;
};

export const updateOrganization = async (id, name, description, contact_email, logo_filename) => {
    const query = `
        UPDATE organization 
        SET name = $1, description = $2, contact_email = $3, logo_filename = $4 
        WHERE organization_id = $5
    `;
    return await pool.query(query, [name, description, contact_email, logo_filename, id]);
};