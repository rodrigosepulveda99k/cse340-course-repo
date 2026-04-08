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
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

export const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Usamos req.session.save para garantizar que el flash llegue a la vista
        return req.session.save(() => res.redirect('/new-project'));
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await projectModel.createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        req.session.save(() => res.redirect(`/project/${newProjectId}`));
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        req.session.save(() => res.redirect('/new-project'));
    }
};