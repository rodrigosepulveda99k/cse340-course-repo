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

/**
 * Creates a new organization in the database.
 */
export const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;

    const query_params = [name, description, contactEmail, logoFilename];
    
    // CORRECCIÓN: Usamos 'pool' que es lo que importaste arriba
    const result = await pool.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};