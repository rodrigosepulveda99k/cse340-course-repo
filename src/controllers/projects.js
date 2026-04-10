import * as projectModel from '../models/projects.js';
import * as organizationModel from '../models/organizations.js';
// Importa aquí tu modelo de categorías si tienes uno, ej:
// import * as categoryModel from '../models/categories.js';

import { body, validationResult } from 'express-validator';

export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('organizationId').notEmpty().withMessage('Organization is required.')
];

export async function showProjectsPage(req, res) {
    try {
        const projects = await projectModel.getAllProjects();
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function showProjectDetailsPage(req, res) {
    try {
        const projectId = req.params.id;
        const project = await projectModel.getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // IMPORTANTE: Si tienes categorías, deberías traerlas aquí
        // const categories = await projectModel.getCategoriesByProject(projectId);
        
        res.render('project-detail', { // Asegúrate que el nombre sea 'project-detail'
            title: project.title, 
            project,
            categories: [] // Enviamos array vacío para que el EJS no explote
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function showNewProjectForm(req, res) {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('add-project', { 
            title: 'Add New Service Project', 
            organizations,
            errors: null 
        });
    } catch (error) {
        console.error('Error in showNewProjectForm:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function processNewProjectForm(req, res) {
    try {
        const errors = validationResult(req);
        const { title, description, location, date, organizationId } = req.body;

        if (!errors.isEmpty()) {
            const organizations = await organizationModel.getAllOrganizations();
            return res.render('add-project', {
                title: 'Add New Service Project',
                organizations,
                errors: errors.array(),
                project: req.body
            });
        }

        await projectModel.createProject(title, description, location, date, organizationId);
        res.redirect('/projects');
    } catch (error) {
        console.error('Error in processNewProjectForm:', error);
        res.status(500).send('Error al crear el proyecto');
    }
}