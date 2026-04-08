import { Router } from 'express';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import categoryRoutes from '../routes/categoryRoute.js';

// Limpiamos los imports para que no haya duplicados
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,     
    processNewOrganizationForm,
    showEditOrganizationForm,      // <-- Agregada
    processEditOrganizationForm,   // <-- Agregada
    organizationValidation         // <-- Agregada
} from './organizations.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home', { title: 'Home' });
});

// --- Rutas de Organizaciones ---
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Nueva Organización
router.get('/new-organization', showNewOrganizationForm); 
router.post('/new-organization', organizationValidation, processNewOrganizationForm); 

// Edición de Organización (PASO 4 y 6)
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// --- Rutas de Categorías ---
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); 

// --- Rutas de Proyectos ---
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

export default router;