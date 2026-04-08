import { Router } from 'express';
import categoryRoutes from '../routes/categoryRoute.js';
import { showCategoriesPage } from './categories.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    requireLogin,
    requireAdmin,
    showUserList 
} from './users.js';

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

// --- Rutas Públicas ---
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// --- Rutas de Registro ---
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireAdmin, showUserList);

export default router;