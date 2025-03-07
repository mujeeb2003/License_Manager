const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        if (!token) return res.status(400).send({ error: "Please log in" });

        const user = jwt.decode(token, process.env.SECRET_KEY);
        if (user.exp < Date.now() / 1000)
            return res.status(401).send({ error: "Session Expired" });

        req.user = {
            email: user.user.email,
            username: user.user.username,
            user_id: user.user.user_id,
            isAdmin: user.user.isAdmin,
            isSuperAdmin: user.user.isSuperAdmin,
            domain_id: user.user.domain_id,
            "Domain.domain_name": user.user["Domain.domain_name"],
        };
        next();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
// module.exports.isLoggedIn = async (req, res, next) => {
//     const token = req.cookies.token;
//     try {
//         if (!token) return res.status(400).send({ error: "Please log in" });

//         const user = jwt.decode(token, process.env.SECRET_KEY);

//         if (user.exp < Date.now() / 1000)
//             return res.status(401).send({ error: "Session Expired" });

//         req.user = {
//             email: user.user.email,
//             username: user.user.username,
//             user_id: user.user.user_id,
//             isAdmin: user.user.isAdmin,
//             isSuperAdmin: user.user.isSuperAdmin,
//             domain_id: user.user.domain_id,
//             "Domain.domain_name": user.user["Domain.domain_name"],
//         };
//         next();
//     } catch (error) {
//         return res.status(500).send({ error: error.message });
//     }
// };

module.exports.isAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = req.user;

        if (!user.isAdmin)
            return res
                .status(401)
                .send({ error: "Only Admin Users are allowed" });

        next();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.isSuperAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = req.user;

        if (!user.isSuperAdmin)
            return res
                .status(401)
                .send({ error: "Only Super Admins are allowed" });

        next();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
