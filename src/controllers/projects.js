import * as projectModel from '../models/projects.js';

// Constant to limit the number of projects displayed on the main page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Controller to show the main projects page
 * Displays only the next 5 upcoming projects
 */
export async function showProjectsPage(req, res) {
    try {
        const projects = await projectModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        
        res.render('projects', { 
            title: "Upcoming Service Projects", 
            projects 
        });
    } catch (error) {
        console.error("Error in showProjectsPage controller:", error);
        res.status(500).send("Internal Server Error");
    }
}

/**
 * Controller to show the details of a specific project
 * Extracts the ID from the URL parameters
 */
export async function showProjectDetailsPage(req, res) {
    try {
        const id = req.params.id; // Captured from /project/:id
        const project = await projectModel.getProjectDetails(id);

        if (!project) {
            return res.status(404).send("Project not found");
        }

        res.render('project', { 
            title: project.title,
            project 
        });
    } catch (error) {
        console.error("Error in showProjectDetailsPage controller:", error);
        res.status(500).send("Internal Server Error");
    }
}