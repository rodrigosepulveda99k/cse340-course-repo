import { Router } from 'express';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import categoryRoutes from '../routes/categoryRoute.js';

// 1. AGREGA LAS FUNCIONES QUE FALTAN EN EL IMPORT DE ABAJO
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,      // <-- Agregada
    processNewOrganizationForm    // <-- Agregada para el POST
} from './organizations.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home', { title: 'Home' });
});

// --- Rutas de Organizaciones ---
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas para Nueva Organización (GET para ver, POST para guardar)
router.get('/new-organization', showNewOrganizationForm); 
router.post('/new-organization', processNewOrganizationForm); // <-- Vital para el paso 5

// --- Rutas de Categorías ---
router.get('/categories', showCategoriesPage);
router.use('/', categoryRoutes); // Esto trae /category/:id, /new-category, etc.

// --- Rutas de Proyectos ---
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

export default router;