import { Router } from 'express';
const router = Router();

// Importas controladores de categorías
import { 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    createNewCategory, 
    showEditCategoryForm, 
    updateCategory, 
    validateCategory 
} from '../controllers/categories.js';

import * as orgController from '../controllers/organizations.js';

router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', validateCategory, createNewCategory);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', validateCategory, updateCategory);

// --- NUEVO: Rutas de Organizaciones ---
// GET: Muestra el formulario
router.get('/new-organization', orgController.showNewOrganizationForm);
// POST: Procesa el envío y guarda en la DB
router.post('/new-organization', orgController.processNewOrganizationForm);

export default router;