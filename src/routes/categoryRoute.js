import { Router } from 'express';
const router = Router();

import { showCategoryDetailsPage, showNewCategoryForm, createNewCategory, showEditCategoryForm, updateCategory, validateCategory } from '../controllers/categories.js';

// Category Details Route
router.get('/category/:id', showCategoryDetailsPage);

// New Category Routes
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', validateCategory, createNewCategory);

// Edit Category Routes
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', validateCategory, updateCategory);

export default router;