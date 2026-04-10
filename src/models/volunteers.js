import { pool } from './db.js';

export const getProjectsByUser = async (userId) => {
    const sql = `
        SELECT p.* FROM public.project p
        JOIN public.project_volunteer pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC`;
    const result = await pool.query(sql, [userId]);
    return result.rows;
};

// Insertar voluntario
export async function addVolunteer(projectId, userId) {
    const sql = "INSERT INTO public.project_volunteer (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
    return await pool.query(sql, [projectId, userId]);
}

// Borrar voluntario
export async function removeVolunteer(projectId, userId) {
    const sql = "DELETE FROM public.project_volunteer WHERE project_id = $1 AND user_id = $2";
    return await pool.query(sql, [projectId, userId]);
}

// Verificar si ya es voluntario (esta es la que usa tu controlador de proyectos)
export async function isUserVolunteering(projectId, userId) {
    const sql = "SELECT 1 FROM public.project_volunteer WHERE project_id = $1 AND user_id = $2";
    const result = await pool.query(sql, [projectId, userId]);
    return result.rowCount > 0;
}