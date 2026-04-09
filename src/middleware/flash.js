const flashMiddleware = (req, res, next) => {
    if (!req.session) {
        console.error("Flash Middleware: No se detectó req.session. Verifica el orden en server.js");
        return next();
    }

    // Inicialización de base
    if (!req.session.flash) {
        req.session.flash = { success: [], error: [], warning: [], info: [] };
    }

    // Definir req.flash con chequeo de existencia interno
    req.flash = (type, message) => {
        // Si por alguna razón el objeto desapareció de la sesión, lo recreamos
        if (!req.session.flash) {
            req.session.flash = { success: [], error: [], warning: [], info: [] };
        }
        // Si el tipo (ej. 'error') no existe, lo creamos como array
        if (!req.session.flash[type]) {
            req.session.flash[type] = [];
        }
        if (message) {
            req.session.flash[type].push(message);
        }
    };

    // Pasar a locals para EJS
    res.locals.messages = req.session.flash;

    res.locals.getMessages = () => {
        const msgs = { ...req.session.flash };
        // Limpiamos la sesión después de que la vista consuma los mensajes
        req.session.flash = { success: [], error: [], warning: [], info: [] };
        return msgs;
    };

    next();
};

export default flashMiddleware;