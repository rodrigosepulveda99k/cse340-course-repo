/**
 * Flash Message Middleware
 */

const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {
        // 1. Inicializar si no existe
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // 2. SETTING: Guardar un mensaje
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
            return;
        }

        // 3. GETTING: Recuperar mensajes
        // Usamos JSON.parse/stringify para crear una copia real de los datos 
        // antes de borrarlos de la sesión.
        const flashData = JSON.parse(JSON.stringify(req.session.flash));

        if (type && !message) {
            const messages = flashData[type] || [];
            req.session.flash[type] = []; // Limpiar solo ese tipo
            return messages;
        }

        // Si no hay argumentos, devolvemos todo y reseteamos la sesión flash
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return flashData;
    };

    next();
}

const flashLocals = (req, res, next) => {
    // Importante: Envolvemos req.flash para asegurar que 'this' sea correcto
    res.locals.flash = () => req.flash(); 
    next();
}

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;