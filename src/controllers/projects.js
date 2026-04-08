import * as projectModel from '../models/projects.js';
import * as catModel from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* --- CONTROLADORES DE VISTA --- */

export const showProjectsPage = async (req, res) => {
    try {
        const projects = await projectModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showProjectDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projectModel.getProjectDetails(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project not found' });
        }

        const categories = await catModel.getCategoriesByProject(id);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

/* --- NUEVA FUNCIONALIDAD: FORMULARIO DE PROYECTOS --- */

export const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { 
            title: 'Add New Service Project', 
            organizations 
        });
    } catch (error) {
        res.status(500).send("Error loading organizations for the form");
    }
};

// Reglas de Validación para Proyectos
export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
    body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 200 }),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format'),
    body('organizationId').notEmpty().withMessage('Organization is required').isInt().withMessage('Invalid organization')
];

export const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach(error => req.flash('error', error.msg));
        return req.session.save(() => res.redirect('/new-project'));
    }

    try {
        const { title, description, location, date, organizationId } = req.body;
        const newProjectId = await projectModel.createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        req.session.save(() => res.redirect(`/project/${newProjectId}`));
    } catch (error) {
        console.error(error);
        req.flash('error', 'There was an error creating the service project.');
        req.session.save(() => res.redirect('/new-project'));
    }
};