import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production'; // Changed to camelCase

// Define the port number the server will listen on
const port = process.env.PORT || 3000; // Changed to camelCase

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

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

// UPDATED: Added async keyword to follow requirements consistently
app.get('/categories', async (req, res) => {
    res.render('categories', { title: 'Project Categories' });
});

// UPDATED: Ensure the listen callback is an arrow function (which you already had!)
app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${nodeEnv}`);
});