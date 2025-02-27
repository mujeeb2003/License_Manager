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

        if (userlength.length !== 0) {
            return res
                .status(400)
                .send({ error: "Only one super admin can be created" });
        }

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
                    isAdmin: true,
                    isSuperAdmin: true,
                    domain_id: 1,
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
        // First, find the user without including the domain
        let user = await User.findOne({
            where: { email },
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

        // If domain_id exists, fetch the domain separately
        let domainName = null;
        if (user.domain_id) {
            try {
                const domain = await Domain.findByPk(user.domain_id);
                if (domain) {
                    domainName = domain.domain_name;
                }
            } catch (domainErr) {
                console.error("Error fetching domain:", domainErr);
                // Continue without domain but don't fail login
            }
        }

        const token = generateToken(user);

        res.status(200).send({
            user: {
                email: user.email,
                username: user.username,
                user_id: user.user_id,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                domain_id: user.domain_id,
                "Domain.domain_name": domainName,
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
    const {domain_id, isSuperAdmin} = req.user;
    try {
        
        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });

        if(user.domain_id === domain_id && !user.isAdmin && !isSuperAdmin) return res.status(400).send({ error: "You cannot assign admin role to this user" });
        
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
        if (!user.isAdmin)
            return res
                .status(402)
                .send({ error: "Only admins can reset password" });

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
    // console.log(password, username);
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
                        // console.log(hash, err);
                        if (err) {
                            return res.status(400).send({ error: err.message });
                        }
                        user.password = hash;
                        await user.save();
                    });
                });
        }
        {
            username && (user.username = username);
        }
        // console.log(user);
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
    const { isAdmin, isSuperAdmin, domain_id: currentDomain } = req.user;
    try {
        let user = await User.findByPk(user_id);

        if (!user) return res.status(404).send({ error: "User not found" });

        if(user.isAdmin && !isSuperAdmin && domain_id === currentDomain) {
            return res.status(403).send({ error: "You cannot assign an admin user in your domain" });
        }

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
        const { domain_id, isSuperAdmin, isAdmin, user_id } = req.user;
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
            where: {},
        };

        if (isSuperAdmin) {
        } else if (isAdmin) {
            userQueryOptions.where = {
                isSuperAdmin: false,
                [Op.or]: [
                    {
                        domain_id: {
                            [Op.in]: descendantDomains,
                        },
                        [Op.or]: [
                            { isAdmin: false }, // All non-admin users
                            { isAdmin: true, domain_id: { [Op.ne]: domain_id } }, // Admin users in descendant domains
                            { user_id: user_id }, // Include themselves
                        ],
                    },
                    // Unassigned users (no domain)
                    {
                        domain_id: null,
                        // isAdmin: false
                    },
                ],
            };
        } else {
            // Non-admin users should not access this endpoint
            return res.status(403).send({ error: "Access denied" });
        }

        const users = await User.findAll(userQueryOptions);

        if (!users || users.length === 0)
            return res.status(200).send({ users: [] });

        return res.status(200).send({ users });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// userController.js - Complete implementation for addUser
module.exports.addUser = async (req, res) => {
    let { username, email, password, isAdmin, domain_id } = req.body;
    const currentUser = req.user;

    try {
        // Validation
        if (!username || !email || !password) {
            return res.status(400).send({ error: "Required fields missing" });
        }

        email = email.toLowerCase();

        // Check if email already exists
        let existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ error: "Email already in use" });
        }

        // Admin permissions check
        if (!currentUser.isAdmin && !currentUser.isSuperAdmin) {
            return res
                .status(403)
                .send({ error: "Only admins can create users" });
        }

        // Domain validation - admins can only assign users to domains they control
        if (domain_id && !currentUser.isSuperAdmin) {
            const descendantDomains = await getDescendantDomains(
                currentUser.domain_id
            );
            descendantDomains.push(currentUser.domain_id);

            if (!descendantDomains.includes(domain_id)) {
                return res.status(403).send({
                    error: "You can only assign users to your domain or subdomains",
                });
            }
        }

        // Admin role assignment checks - prevent parallel admins
        if (isAdmin && !currentUser.isSuperAdmin) {
            if (domain_id === currentUser.domain_id) {
                return res.status(403).send({
                    error: "You cannot create an admin in your own domain",
                });
            }
        }

        // Create the user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hash,
            isAdmin: isAdmin || false,
            isSuperAdmin: false, // Never allow creating superadmins through this endpoint
            domain_id: domain_id || null,
            createdBy: currentUser.user_id,
            isDisable: false,
        });

        // Get domain name if domain_id is provided
        let domainName = null;
        if (domain_id) {
            const domain = await Domain.findByPk(domain_id);
            if (domain) {
                domainName = domain.domain_name;
            }
        }

        // Return user without sensitive data
        const userResponse = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin,
            isDisable: user.isDisable,
            domain_id: user.domain_id,
            "Domain.domain_name": domainName,
        };

        return res.status(201).send({
            user: userResponse,
            message: "User created successfully",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.checkSuperAdmin = async (req, res) => {
    try {
        const superAdmin = await User.findOne({
            where: { isSuperAdmin: true },
        });

        return res.status(200).send({
            exists: !!superAdmin,
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
