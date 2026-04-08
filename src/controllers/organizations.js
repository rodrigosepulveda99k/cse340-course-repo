import * as orgModel from '../models/organizations.js';

export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await orgModel.getAllOrganizations();
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });
    } catch (error) {
        console.error('Error in showOrganizationsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const organization = await orgModel.getOrganizationById(id);

        if (!organization) return res.status(404).send('Organization not found');

        res.render('organization-details', {
            title: organization.name,
            organization
        });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Se agregó "export" para que las rutas puedan usarlo
export const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

// NUEVA FUNCIÓN: Procesa el envío del formulario
export const processNewOrganizationForm = async (req, res) => {
    try {
        // Extraemos los datos del req.body (nombres del atributo 'name' en tu EJS)
        const { name, description, contactEmail } = req.body;
        
        // El logo fijo como pide la tarea
        const logoFilename = 'placeholder-logo.png'; 

        // Llamamos al modelo que corregimos antes
        const organizationId = await orgModel.createOrganization(
            name, 
            description, 
            contactEmail, 
            logoFilename
        );

        // Redirigimos a la página de detalles de la nueva organización
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error in processNewOrganizationForm:', error);
        // Aquí podrías renderizar de nuevo el form con un mensaje de error
        res.status(500).send('Error processing the new organization form');
    }
};