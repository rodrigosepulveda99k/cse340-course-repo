import * as catModel from '../models/categories.js';
import * as projModel from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const validateCategory = [
  body('category_name')
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es requerido.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres.')
];

export { validateCategory };

export async function showCategoryDetailsPage(req, res) {
    try {
        const id = req.params.id;
        const category = await catModel.getCategoryById(id);
        const projects = await projModel.getProjectsByCategory(id);

        if (!category) return res.status(404).send("Category not found");

        res.render('category-details', {
            title: category.category_name,
            category,
            projects
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export async function showNewCategoryForm(req, res) {
    res.render('category/new-category', { title: 'Add New Category' });
}

export async function createNewCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('category/new-category', { title: 'Add New Category', errors: errors.array(), category_name: req.body.category_name });
    }
    const { category_name } = req.body;
    try {
        const result = await catModel.createCategory(category_name);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Error creating category");
    }
}

export async function showEditCategoryForm(req, res) {
    const id = req.params.id;
    try {
        const category = await catModel.getCategoryById(id);
        if (!category) return res.status(404).send("Category not found");
        res.render('category/edit-category', { title: 'Edit Category', category });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export async function updateCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const id = req.params.id;
        const category = await catModel.getCategoryById(id);
        return res.render('category/edit-category', { title: 'Edit Category', category, errors: errors.array(), category_name: req.body.category_name });
    }
    const id = req.params.id;
    const { category_name } = req.body;
    try {
        const result = await catModel.updateCategory(id, category_name);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Error updating category");
    }
}