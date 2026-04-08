const flashMiddleware = (req, res, next) => {
    // 1. Inicializar almacenamiento en sesión si no existe
    if (!req.session.flash) {
        req.session.flash = { success: [], error: [], warning: [], info: [] };
    }

    // 2. Definir req.flash para usar en controladores (req.flash('success', 'msg'))
    req.flash = (type, message) => {
        if (type && message) {
            if (!req.session.flash[type]) req.session.flash[type] = [];
            req.session.flash[type].push(message);
        }
    };

    // 3. PASAR LA FUNCIÓN A EJS (Esto soluciona el ReferenceError)
    // Definimos res.locals.flash como una función que extrae y limpia los mensajes
    res.locals.flash = () => {
        const messages = JSON.parse(JSON.stringify(req.session.flash));
        // Limpiamos la sesión después de extraerlos
        req.session.flash = { success: [], error: [], warning: [], info: [] };
        return messages;
    };

    next();
};

export default flashMiddleware;