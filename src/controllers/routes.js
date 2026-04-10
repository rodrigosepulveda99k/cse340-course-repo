import { Router } from 'express';
import categoryRoutes from '../routes/categoryRoute.js';
import { showCategoriesPage } from './categories.js';
import { handleAddVolunteer, handleRemoveVolunteer } from './volunteers.js';

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
    projectValidation // <--- Debe llamarse igual que en projects.js
} from './projects.js';

const router = Router();

// 1. RUTAS DE AUTENTICACIÓN (Prioridad alta)
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// 2. RUTAS DE VOLUNTARIADO (Específicas - Deben ir arriba)
router.get('/volunteer/add/:projectId', requireLogin, handleAddVolunteer);
router.get('/volunteer/remove/:projectId', requireLogin, handleRemoveVolunteer);

// 3. RUTAS DE PROYECTOS
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // :id es genérico, pero va después de /add
router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);

// 4. RUTAS DE ORGANIZACIONES
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireLogin, showNewOrganizationForm); 
router.post('/new-organization', requireLogin, organizationValidation, processNewOrganizationForm); 
router.get('/edit-organization/:id', requireLogin, showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, organizationValidation, processEditOrganizationForm);

// 5. RUTAS DE USUARIO Y DASHBOARD
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireAdmin, showUserList);

// 6. INICIO
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// 7. RUTAS DE CATEGORÍAS (Al final para no interferir)
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); 

export default router;