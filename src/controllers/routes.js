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

// --- Rutas Públicas e Inicio ---
// Eliminé la duplicidad de la ruta raíz. Dejamos solo una.
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// --- Rutas de Organizaciones ---
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
// Solo permitimos crear/editar si está logueado (Opcional, pero recomendado por seguridad)
router.get('/new-organization', requireLogin, showNewOrganizationForm); 
router.post('/new-organization', requireLogin, organizationValidation, processNewOrganizationForm); 
router.get('/edit-organization/:id', requireLogin, showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, organizationValidation, processEditOrganizationForm);

// --- Rutas de Categorías ---
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); 

// --- Rutas de Proyectos ---
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);

// --- Rutas de Autenticación ---
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// --- Rutas Protegidas ---
router.get('/dashboard', requireLogin, showDashboard);

// Chequeo de QA: requireAdmin aplicado correctamente aquí
router.get('/users', requireLogin, requireAdmin, showUserList);

export default router;