import * as projectModel from '../models/projects.js';
import * as catModel from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

export const showProjectDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projectModel.getProjectDetails(id);

        if (!project) return res.status(404).send('Project not found');

        const categories = await catModel.getCategoriesByProject(id);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};