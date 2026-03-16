import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllProjects } from './src/models/projects.js'; // Agregado: Importación de proyectos
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */

app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

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

// RUTA ACTUALIZADA: Ahora es dinámica para cumplir el Criterio 2
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects(); // Llama a la BD
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error loading projects:", error);
        res.status(500).send("Error loading projects page");
    }
});

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
 * Start Server
 */
app.listen(port, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${port}`);
        console.log(`Environment: ${nodeEnv}`);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
});