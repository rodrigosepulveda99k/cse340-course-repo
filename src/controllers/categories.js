import * as catModel from '../models/categories.js';
import * as projModel from '../models/projects.js';
import { body, validationResult } from 'express-validator';

export const validateCategory = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es requerido.')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres.')
];

export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await catModel.getAllCategories();
        res.render('categories', { title: 'Project Categories', categories });
    } catch (error) {
        console.error('Error in showCategoriesPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showCategoryDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await catModel.getCategoryById(id);
        const projects = await projModel.getProjectsByCategory(id);

        if (!category) return res.status(404).send('Category not found');

        res.render('category-details', {
            title: category.category_name,
            category,
            projects
        });
    } catch (error) {
        console.error('Error in showCategoryDetailsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showNewCategoryForm = async (req, res) => {
    res.render('category/new-category', { title: 'Add New Category' });
};

export const createNewCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('category/new-category', { title: 'Add New Category', errors: errors.array(), category_name: req.body.category_name });
    }

    const { category_name } = req.body;
    try {
        await catModel.createCategory(category_name);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error in createNewCategory controller:', error);
        res.status(500).send('Error creating category');
    }
};

export const showEditCategoryForm = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await catModel.getCategoryById(id);
        if (!category) return res.status(404).send('Category not found');
        res.render('category/edit-category', { title: 'Edit Category', category });
    } catch (error) {
        console.error('Error in showEditCategoryForm controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateCategory = async (req, res) => {
    const errors = validationResult(req);
    const id = req.params.id;

    if (!errors.isEmpty()) {
        const category = await catModel.getCategoryById(id);
        return res.render('category/edit-category', { title: 'Edit Category', category, errors: errors.array(), category_name: req.body.category_name });
    }

    const { category_name } = req.body;
    try {
        await catModel.updateCategory(id, category_name);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error in updateCategory controller:', error);
        res.status(500).send('Error updating category');
    }
};