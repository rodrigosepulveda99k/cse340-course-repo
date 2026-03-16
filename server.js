import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js'; // Importación agregada
import { getAllCategories } from './src/models/categories.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */

app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// ROUTE UPDATED: Now fetches organizations from the database
app.get('/organizations', async (req, res) => {
    // 1. Fetch the data from the PostgreSQL table
    const organizations = await getAllOrganizations();
    
    // 2. Set the page title
    const title = 'Our Partner Organizations';

    // 3. Render the view, passing both the title and the organizations array
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
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