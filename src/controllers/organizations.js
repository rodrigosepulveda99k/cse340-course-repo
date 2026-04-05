import * as orgModel from '../models/organizations.js';

export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await orgModel.getAllOrganizations();
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });
    } catch (error) {
        console.error('Error in showOrganizationsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;
        const organization = await orgModel.getOrganizationById(id);

        if (!organization) return res.status(404).send('Organization not found');

        res.render('organization-details', {
            title: organization.name,
            organization
        });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage controller:', error);
        res.status(500).send('Internal Server Error');
    }
};
