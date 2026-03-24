import * as catModel from '../models/categories.js';
import * as projModel from '../models/projects.js';

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