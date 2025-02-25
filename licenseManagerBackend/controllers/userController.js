const { User, Domain } = require("../models/index.js");
const { generateToken } = require("../utils/generateToken.js");
const bcrypt = require("bcryptjs");
const { getDescendantDomains } = require("../utils/getDescendantDomain.js");
const { Op } = require("sequelize");

module.exports.register = async (req, res) => {
    let { username, email, password } = req.body;
    try {
        email = email.toLowerCase();
        let userlength = await User.findAll();

        let user = await User.findOne({ where: { email } });
        if (user)
            return res.status(400).send({ error: "Email already in use" });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(400).send({ error: err.message });
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(400).send({ error: err.message });

                user = await User.create({
                    username,
                    email,
                    password: hash,
                    isAdmin: userlength == 0 ? true : false,
                    isSuperAdmin: userlength == 0 ? true : false,
                    domain_id: userlength === 0 ? 1 : null,
                });

                res.status(200).send({
                    user: {
                        email: user.email,
                        username: user.username,
                        user_id: user.user_id,
                    },
                    message: "Registered successfull",
                });
            });
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password)
        return res
            .status(400)
            .send({ error: "Please provide email and password" });
    email = email.toLowerCase();
    try {
        let user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Domain,
                    attributes: ["domain_name"],
                },
            ],
            raw: true,
        });

        // console.log(JSON.stringify(user));
        if (!user) {
            return res
                .status(404)
                .send({ error: "Email or password is incorrect" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res
                .status(400)
                .send({ error: "Email or password is incorrect" });

        if (user.isDisable)
            return res.status(400).send({ error: "User is Disabled" });

        const token = generateToken(user);

        res.status(200).send({
            user: {
                email: user.email,
                username: user.username,
                user_id: user.user_id,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                domain_id: user.domain_id,
                "Domain.domain_name": user["Domain.domain_name"],
            },
            token,
            message: "login successfull",
            domain_message: !user.domain_id
                ? "Please contact administrator to assign domain"
                : "",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.getLoggedinUser = async (req, res) => {
    try {
        return res.status(200).send({ user: req.user });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.toggleAdmin = async (req, res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });

        user.isAdmin = !user.isAdmin;

        await user.save();

        return res.send({ user, message: "User update successfull" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.userDisable = async (req, res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });

        user.isDisable = !user.isDisable;

        await user.save();

        return res.send({ user, message: "User update successfull" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.logoutUser = async (req, res) => {
    try {
        return res.status(200).send({ message: "Successfully Logged Out" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.resetPassword = async (req, res) => {
    const { user_id, password } = req.body;
    const user = req.user;

    try {
        if (!user.isSuperAdmin)
            return res
                .status(402)
                .send({ error: "Only Super admins can reset password" });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(400).send({ error: err.message });

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(400).send({ error: err.message });

                const user = await User.findByPk(user_id);

                if (!user)
                    return res.status(404).send({ error: "User not found" });

                user.password = hash;

                await user.save();

                return res.status(200).send({
                    user: user,
                    message: "Password successfully reset.",
                });
            });
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.updateUser = async (req, res) => {
    const { user_id, password, username } = req.body;
    console.log(password, username);
    try {
        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });
        let hashPassword;
        {
            password &&
                bcrypt.genSalt(10, (err, salt) => {
                    if (err)
                        return res.status(400).send({ error: err.message });
                    bcrypt.hash(password, salt, async (err, hash) => {
                        console.log(hash, err);
                        if (err) {
                            return res.status(400).send({ error: err.message });
                        }
                        user.password = hash;
                        await user.save()
                    });
                });
        }
        {
            username && (user.username = username);
        }
        console.log(user);
        let newuser = {
            user_id: user.user_id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
            isDisable: user.isDisable,
            domain_id: user.domain_id,
        };

        return res.status(200).send({
            user: newuser,
            message: "Update Successfull",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.assignDomain = async (req, res) => {
    const { user_id, domain_id } = req.body;
    try {
        let user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });

        user.domain_id = domain_id;

        await user.save();

        user = await User.findByPk(user_id, {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: Domain,
                    attributes: ["domain_name"],
                },
            ],
            raw: true,
        });
        return res.send({ user, message: "User update successfull" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const { domain_id, isSuperAdmin } = req.user;
        const descendantDomains = await getDescendantDomains(domain_id);
        descendantDomains.push(domain_id);

        let userQueryOptions = {
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: Domain,
                    attributes: ["domain_name"],
                },
            ],
            raw: true,
        };

        // Apply domain filtering only if the user is not a superadmin
        if (!req.user.isSuperAdmin) {
            userQueryOptions.include[0].where = {
                [Op.or]: [
                    {
                        domain_id: {
                            [Op.in]: descendantDomains,
                        },
                    },
                    {
                        domain_id: null,
                    },
                ],
            };
        }

        const users = await User.findAll(userQueryOptions);

        if (!users) return res.status(400).send({ error: "No users found" });

        return res.status(200).send({ users });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
