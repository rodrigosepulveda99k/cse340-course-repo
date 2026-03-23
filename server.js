import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
// Import all project-related database functions
import * as projectModel from './src/models/projects.js'; 
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Environment and Port configuration
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;
const NUMBER_OF_UPCOMING_PROJECTS = 5; // Limit for the upcoming projects list

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Express and EJS View Engine configuration
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Middlewares
 */

// 1. Request Logger Middleware (Runs only in development mode)
app.use((req, res, next) => {
    if (nodeEnv === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); 
});

// 2. Global Variables Middleware
// Makes NODE_ENV available to all EJS templates (required by partials/footer)
app.use((req, res, next) => {
    res.locals.NODE_ENV = nodeEnv; 
    res.locals.nodeEnv = nodeEnv; 
    next();
});

/**
 * Routes
 */

// Home Page
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// Organizations Listing Page
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error("Error loading organizations:", error);
        res.status(500).send("Error loading organizations page");
    }
});

// Upcoming Projects Page (Filtered and limited to 5)
app.get('/projects', async (req, res) => {
    try {
        // Fetches only the next 5 upcoming projects from the database
        const projects = await projectModel.getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error loading upcoming projects:", error);
        res.status(500).send("Error loading projects page");
    }
});

// Individual Project Details Page (Dynamic Route using ID)
app.get('/project/:id', async (req, res) => {
    try {
        const id = req.params.id; // Extracts ID from the URL parameter
        const project = await projectModel.getProjectDetails(id);
        
        // Handle case where project ID does not exist
        if (!project) {
            return res.status(404).send("Project not found");
        }

        res.render('project', { 
            title: project.title, 
            project 
        });
    } catch (error) {
        console.error("Error loading project details:", error);
        res.status(500).send("Error loading project details page");
    }
});

// Project Categories Page
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Project Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error("Error loading categories:", error);
        res.status(500).send("Error loading categories page");
    }
});

/**
 * Server Execution
 */
app.listen(port, async () => {
    try {
        // Verify database connection on startup
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${port}`);
        console.log(`Environment: ${nodeEnv}`);
    } catch (error) {
        console.error('Error connecting to the database on startup:', error.message);
    }
});