import { Router } from 'express';
import categoryRoutes from '../routes/categoryRoute.js';
import { showCategoriesPage } from './categories.js';
import { handleAddVolunteer, handleRemoveVolunteer } from './volunteers.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    registrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    requireLogin,
    requireAdmin,
    showUserList 
} from './users.js';

import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,     
    processNewOrganizationForm,
    showEditOrganizationForm,      
    processEditOrganizationForm,   
    organizationValidation          
} from './organizations.js';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation 
} from './projects.js';

const router = Router();

// 1. HOME
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// 2. AUTENTICACIÓN
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/register', showUserRegistrationForm);
router.post('/register', registrationValidation, processUserRegistrationForm);

// 3. DASHBOARD Y USUARIOS
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireAdmin, showUserList);

// 4. ABOUT
router.get('/about', (req, res) => res.render('about', { title: 'About' }));

// 4. RUTAS DE PROYECTOS (Orden Crítico: lo estático va ANTES que lo dinámico :id)
router.get('/projects', showProjectsPage);
router.get('/new-project', requireLogin, requireAdmin, showNewProjectForm); // ADMIN
router.post('/new-project', requireLogin, requireAdmin, projectValidation, processNewProjectForm); // ADMIN
router.get('/project/:id', showProjectDetailsPage); 

// 5. RUTAS DE ORGANIZACIONES (Orden Crítico)
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', requireLogin, requireAdmin, showNewOrganizationForm); // ADMIN
router.post('/new-organization', requireLogin, requireAdmin, organizationValidation, processNewOrganizationForm); // ADMIN
router.get('/edit-organization/:id', requireLogin, requireAdmin, showEditOrganizationForm); // ADMIN
router.post('/edit-organization/:id', requireLogin, requireAdmin, organizationValidation, processEditOrganizationForm); // ADMIN
router.get('/organization/:id', showOrganizationDetailsPage);

// 6. VOLUNTARIADO
router.post('/volunteer/add/:projectId', requireLogin, handleAddVolunteer);
router.post('/volunteer/remove/:projectId', requireLogin, handleRemoveVolunteer);

// 7. CATEGORÍAS
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); 

export default router;