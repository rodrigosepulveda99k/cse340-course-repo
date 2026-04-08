import { pool } from '../models/db.js'; // Asegúrate de que la ruta a db.js sea correcta

/* --- FUNCIONES DE BASE DE DATOS (MODELO) --- */

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

export const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;
    const query_params = [name, description, contactEmail, logoFilename];
    const result = await pool.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }
    return result.rows[0].organization_id;
};

/* --- FUNCIONES DEL CONTROLADOR (LÓGICA) --- */

export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const organization = await getOrganizationById(id);
        if (!organization) return res.status(404).send('Organization not found');

        res.render('organization-details', {
            title: organization.name,
            organization
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showNewOrganizationForm = async (req, res) => {
    res.render('new-organization', { title: 'Add New Organization' });
};

export const processNewOrganizationForm = async (req, res) => {
    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        
        // 1. Guardamos el mensaje
        req.flash('success', 'Organization added successfully!');

        // 2. FORZAMOS el guardado de la sesión antes de redirigir
        req.session.save((err) => {
            if (err) {
                console.error("Error salvando sesión:", err);
            }
            res.redirect(`/organization/${organizationId}`);
        });

    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Error creating organization');
        res.redirect('/new-organization');
    }
};