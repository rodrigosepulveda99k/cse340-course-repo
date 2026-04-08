import * as orgModel from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

/* --- CONTROLADORES DE VISTA --- */

// Muestra la lista de todas las organizaciones
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await orgModel.getAllOrganizations();
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });
    } catch (error) {
        console.error('Error in showOrganizationsPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Muestra el detalle de una organización específica
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
        console.error('Error in showOrganizationDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Muestra el formulario para crear una nueva organización
export const showNewOrganizationForm = async (req, res) => {
    res.render('new-organization', { title: 'Add New Organization' });
};

// Muestra el formulario para editar una organización existente
export const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await orgModel.getOrganizationById(organizationId);

        if (!organizationDetails) {
            req.flash('error', 'Organization not found');
            return req.session.save(() => res.redirect('/organizations'));
        }

        // Renderizado directo desde la raíz de views según tu VS Code
        res.render('edit-organization', { 
            title: 'Edit Organization', 
            organizationDetails 
        });
    } catch (error) {
        console.error('Error in showEditOrganizationForm:', error);
        res.status(500).send('Error loading edit form');
    }
};

/* --- PROCESAMIENTO DE FORMULARIOS --- */

// Procesa la creación de una nueva organización
export const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return req.session.save(() => res.redirect('/new-organization'));
    }

    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await orgModel.createOrganization(name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization added successfully!');
        req.session.save(() => res.redirect(`/organization/${organizationId}`));
    } catch (error) {
        req.flash('error', 'Failed to create organization.');
        req.session.save(() => res.redirect('/new-organization'));
    }
};

// Procesa la actualización de una organización existente
export const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return req.session.save(() => res.redirect(`/edit-organization/${organizationId}`));
    }

    try {
        const { name, description, contactEmail, logoFilename } = req.body;
        
        await orgModel.updateOrganization(organizationId, name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization updated successfully!');
        req.session.save(() => res.redirect(`/organization/${organizationId}`));
    } catch (error) {
        console.error('Error in processEditOrganizationForm:', error);
        req.flash('error', 'Failed to update organization.');
        req.session.save(() => res.redirect(`/edit-organization/${organizationId}`));
    }
};

/* --- VALIDACIONES --- */

export const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 }).withMessage('Name must be 3-150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .isEmail().withMessage('Please provide a valid email address'),
    body('logoFilename')
        .trim()
        .notEmpty().withMessage('Logo filename is required')
];