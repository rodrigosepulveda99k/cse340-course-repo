import * as projectModel from '../models/projects.js';
import * as organizationModel from '../models/organizations.js';
import * as volunteerModel from '../models/volunteers.js';
import { body, validationResult } from 'express-validator';

// 1. Reglas de Validación
export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('location').trim().notEmpty().withMessage('Location is required.'),
    body('date').notEmpty().withMessage('Date is required.'),
    body('organizationId').notEmpty().withMessage('Organization is required.')
];

// 2. Mostrar lista de proyectos
export async function showProjectsPage(req, res) {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { 
            title: 'Upcoming Service Projects', 
            projects 
        });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 3. Mostrar detalles de un proyecto
export async function showProjectDetailsPage(req, res) {
    try {
        const projectId = parseInt(req.params.id);
        if (isNaN(projectId)) return res.status(400).send('Invalid project ID');

        const project = await projectModel.getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }

        let isVolunteering = false;

        if (req.session && req.session.user) {
            const accountId = req.session.user.account_id || req.session.user.id; 
            isVolunteering = await volunteerModel.isUserVolunteering(projectId, accountId);
        }

        res.render('project', { 
            title: project.title, 
            project,
            isVolunteering, 
            categories: [] 
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 4. Mostrar formulario de nuevo proyecto
export async function showNewProjectForm(req, res) {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('new-project', { 
            title: 'Add New Service Project', 
            organizations,
            errors: null,
            project: {} 
        });
    } catch (error) {
        console.error('Error in showNewProjectForm:', error);
        res.status(500).send('Internal Server Error');
    }
}

// 5. Procesar el formulario de nuevo proyecto
export async function processNewProjectForm(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const organizations = await organizationModel.getAllOrganizations();
            return res.render('new-project', {
                title: 'Add New Service Project',
                organizations,
                errors: errors.array(),
                project: req.body
            });
        }

        const { title, description, location, date, organizationId } = req.body;
        await projectModel.createProject(title, description, location, date, organizationId);
        res.redirect('/projects');
    } catch (error) {
        console.error('Error in processNewProjectForm:', error);
        res.status(500).send('Error al crear el proyecto');
    }
}