import { pool } from './db.js';

export const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const getOrganizationById = async (id) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};