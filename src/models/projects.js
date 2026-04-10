import * as projectModel from '../models/projects.js';
import * as organizationModel from '../models/organizations.js';

/**
 * Muestra la lista de todos los proyectos
 */
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

/**
 * Muestra los detalles de un proyecto específico
 */
export async function showProjectDetailsPage(req, res) {
    try {
        const projectId = req.params.id;
        const project = await projectModel.getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }

        res.render('project-details', { 
            title: project.title, 
            project 
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Muestra el formulario para añadir un nuevo proyecto
 */
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

/**
 * Procesa la creación de un nuevo proyecto (POST)
 */
export async function processNewProjectForm(req, res) {
    try {
        // Extraemos los datos del cuerpo de la petición
        const { title, description, location, date, organizationId } = req.body;

        // Log de depuración para Render
        console.log('Form data received:', req.body);

        // Validación manual básica
        if (!title || !organizationId) {
            const organizations = await organizationModel.getAllOrganizations();
            return res.render('add-project', {
                title: 'Add New Service Project',
                organizations,
                error: 'Title and Organization are required.',
                errors: null
            });
        }

        // Llamada a la función createProject que definiste en el modelo
        const newProjectId = await projectModel.createProject(
            title, 
            description, 
            location, 
            date, 
            organizationId
        );

        if (newProjectId) {
            console.log(`Project successfully created with ID: ${newProjectId}`);
            res.redirect('/projects');
        }

    } catch (error) {
        console.error('Error in processNewProjectForm controller:', error);
        
        const organizations = await organizationModel.getAllOrganizations();
        res.render('add-project', {
            title: 'Add New Service Project',
            organizations,
            error: 'Database error: Could not create project.',
            errors: null
        });
    }
}