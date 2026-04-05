import { Router } from 'express';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import categoryRoutes from '../routes/categoryRoute.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home', { title: 'Home' });
});

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.use('/', categoryRoutes);

export default router;
