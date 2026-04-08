import * as projectModel from '../models/projects.js';
import * as catModel from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Muestra la página principal de proyectos con los próximos 5 eventos.
 */
export const showProjectsPage = async (req, res) => {
    try {
        const projects = await projectModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        console.error('Error in showProjectsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * Muestra los detalles de un proyecto específico, incluyendo sus categorías asociadas.
 */
export const showProjectDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projectModel.getProjectDetails(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project not found' });
        }

        // Recupera las categorías vinculadas a este proyecto para mostrar los links (tags)
        const categories = await catModel.getCategoriesByProject(id);

        res.render('project', {
            title: project.title,
            project,
            categories // Estas se usan en project.ejs para los links a /category/:id
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};