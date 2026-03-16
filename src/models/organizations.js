import { pool } from './db.js'; // Importación nombrada con llaves

export const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename 
        FROM public.organization;
    `;
    
    // CAMBIO CLAVE: Usar 'pool' en lugar de 'db'
    const result = await pool.query(query); 
    
    return result.rows;
};