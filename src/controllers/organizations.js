import * as orgModel from '../models/organizations.js';
import { body, validationResult } from 'express-validator'; // 'body' se importa de aquí

/* --- CONTROLADORES DE VISTA --- */

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

export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send('Invalid organization ID');
        const organization = await orgModel.getOrganizationById(id);

        if (!organization) {
            req.flash('error', 'Organization not found');
            return req.session.save(() => res.redirect('/organizations'));
        }

        res.render('organization-details', {
            title: organization.name,
            organization
        });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', { title: 'Add New Organization' });
};

export const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.id);
        if (isNaN(organizationId)) return res.status(400).send('Invalid organization ID');
        const organizationDetails = await orgModel.getOrganizationById(organizationId);

        if (!organizationDetails) {
            req.flash('error', 'Organization not found');
            return req.session.save(() => res.redirect('/organizations'));
        }

        res.render('edit-organization', { 
            title: 'Edit Organization', 
            organizationDetails 
        });
    } catch (error) {
        console.error('Error in showEditOrganizationForm:', error);
        res.status(500).send('Error loading edit form');
    }
};

/* --- PROCESAMIENTO --- */

export const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return req.session.save(() => res.redirect('/new-organization'));
    }

    try {
        const { name, description, contactEmail } = req.body;
        const logo_filename = req.body.logoFilename || 'placeholder-logo.png';

        const organizationId = await orgModel.createOrganization(name, description, contactEmail, logo_filename);
        
        req.flash('success', 'Organization added successfully!');
        req.session.save(() => res.redirect(`/organization/${organizationId}`));
    } catch (error) {
        console.error('Error in processNewOrganizationForm:', error);
        req.flash('error', 'Failed to create organization.');
        req.session.save(() => res.redirect('/new-organization'));
    }
};

export const processEditOrganizationForm = async (req, res) => {
    const organizationId = parseInt(req.params.id);
    if (isNaN(organizationId)) return res.status(400).send('Invalid organization ID');
    const results = validationResult(req);
    
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return req.session.save(() => res.redirect(`/edit-organization/${organizationId}`));
    }

    try {
        const { name, description, contactEmail } = req.body;
        const logo_filename = req.body.logoFilename || 'placeholder-logo.png';
        
        await orgModel.updateOrganization(organizationId, name, description, contactEmail, logo_filename);
        
        req.flash('success', 'Organization updated successfully!');
        req.session.save(() => res.redirect(`/organization/${organizationId}`));
    } catch (error) {
        console.error('Error in processEditOrganizationForm:', error);
        req.flash('error', 'Failed to update organization.');
        req.session.save(() => res.redirect(`/edit-organization/${organizationId}`));
    }
};

/* --- VALIDACIONES CORREGIDAS --- */

export const organizationValidation = [
    body('name') // Eliminado el prefijo orgModel.
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
        .optional({ checkFalsy: true })
        .trim()
];