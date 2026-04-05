import { Router } from 'express';
const router = Router();

// Import the controller functions
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

// Import category routes
import categoryRoutes from './routes/categoryRoute.js';

// Route for the main projects page (Lists the next 5 upcoming projects)
// Note: No changes needed here if the route already existed, 
// the controller now handles the "upcoming" logic internally.
router.get('/projects', showProjectsPage);

// NEW: Route for a single project details page
// The ':id' is a route parameter that captures the ID from the URL
router.get('/project/:id', showProjectDetailsPage);

// Use category routes
router.use('/', categoryRoutes);

export default router;