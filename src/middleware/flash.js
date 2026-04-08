const flashMiddleware = (req, res, next) => {
    // 1. Inicializar el objeto en la sesión si no existe
    if (!req.session) {
        console.error("Error: Session middleware no encontrado. Revisa el orden en server.js");
        return next();
    }

    if (!req.session.flash) {
        req.session.flash = { success: [], error: [], warning: [], info: [] };
    }

    // 2. Definir req.flash para los controladores
    // Permite hacer req.flash('success', 'Mensaje')
    req.flash = (type, message) => {
        if (type && message) {
            if (!req.session.flash[type]) req.session.flash[type] = [];
            req.session.flash[type].push(message);
        }
    };

    // 3. Pasar los mensajes a EJS de forma segura
    // Clonamos los mensajes a res.locals para que EJS los vea
    res.locals.messages = JSON.parse(JSON.stringify(req.session.flash));
    
    // También definimos la función flash() por si el header la sigue llamando
    res.locals.flash = () => res.locals.messages;

    // 4. LIMPIEZA POST-RENDER:
    // Solo vaciamos la sesión después de que la respuesta se haya enviado
    res.on('finish', () => {
        if (req.session && req.session.flash) {
            req.session.flash = { success: [], error: [], warning: [], info: [] };
        }
    });

    next();
};

export default flashMiddleware;