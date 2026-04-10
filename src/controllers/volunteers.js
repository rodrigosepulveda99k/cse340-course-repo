import * as volunteerModel from '../models/volunteers.js';

export async function handleAddVolunteer(req, res) {
    try {
        const { projectId } = req.params;
        const userId = req.session.user.account_id;

        await volunteerModel.addVolunteer(projectId, userId);

        // Mensaje flash opcional
        if (req.flash) req.flash('success', 'Te has registrado como voluntario.');

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.status(500).send('Error processing volunteer registration');
    }
}

export async function handleRemoveVolunteer(req, res) {
    try {
        const { projectId } = req.params;
        const userId = req.session.user.account_id;

        await volunteerModel.removeVolunteer(projectId, userId);

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.status(500).send('Error removing volunteer registration');
    }
}