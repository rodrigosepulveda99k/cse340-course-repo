import { Router } from 'express';
import categoryRoutes from '../routes/categoryRoute.js';
import { showCategoriesPage } from './categories.js';

// Organizaciones
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,     
    processNewOrganizationForm,
    showEditOrganizationForm,      
    processEditOrganizationForm,   
    organizationValidation         
} from './organizations.js';

// Proyectos
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation 
} from './projects.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home', { title: 'Home' });
});

// --- Rutas de Organizaciones ---
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm); 
router.post('/new-organization', organizationValidation, processNewOrganizationForm); 
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// --- Rutas de Categorías ---
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); 

// --- Rutas de Proyectos ---
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

export default router;