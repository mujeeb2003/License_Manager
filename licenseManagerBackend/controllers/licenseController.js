const {
    License,
    User,
    Vendor,
    Category,
    Status,
    Log,
    Manager,
    Domain,
} = require("../models/index.js");
const { Op } = require("sequelize");
const { sendNotificationEmail } = require("../utils/sendEmailNotification.js");
const { getDescendantDomains } = require("../utils/getDescendantDomain.js");

module.exports.getLicenses = async (req, res) => {
    try {
        const { domain_id, isSuperAdmin } = req.user;
        const descendantDomains = await getDescendantDomains(domain_id);
        descendantDomains.push(domain_id);
        let licenses;
        // console.log(descendantDomains);
        {isSuperAdmin ? 
            licenses = await License.findAll({
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "user_id",
                        "vendor_id",
                        "category_id",
                        "status_id",
                        "manager_id",
                        "domain_id",
                    ],
                },
                include: [
                    {
                        model: User,
                        attributes: ["username"],
                    },
                    {
                        model: Vendor,
                        attributes: ["vendor_name"],
                    },
                    {
                        model: Category,
                        attributes: ["category_name"],
                    },
                    {
                        model: Status,
                        attributes: ["status_name"],
                    },
                    {
                        model: Manager,
                        attributes: ["name", "email"],
                    },
                    {
                        model: Domain,
                        attributes: ["domain_name"],
                    },
                ],
                raw: true,
                order: [["expiry_date", "ASC"]],
            })
            :
            licenses = await License.findAll({
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "user_id",
                        "vendor_id",
                        "category_id",
                        "status_id",
                        "manager_id",
                        "domain_id",
                    ],
                },
                include: [
                    {
                        model: User,
                        attributes: ["username"],
                    },
                    {
                        model: Vendor,
                        attributes: ["vendor_name"],
                    },
                    {
                        model: Category,
                        attributes: ["category_name"],
                    },
                    {
                        model: Status,
                        attributes: ["status_name"],
                    },
                    {
                        model: Manager,
                        attributes: ["name", "email"],
                    },
                    {
                        model: Domain,
                        attributes: ["domain_name"],
                        where: {
                            domain_id: { [Op.in]: descendantDomains },
                        },
                    },
                ],
                raw: true,
                order: [["expiry_date", "ASC"]],
            });
        }
        
        if (!licenses)
            return res.status(400).send({ error: "Licenses not found" });

        return res.status(200).send({ licenses });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.createLicense = async (req, res) => {
    const {
        title,
        expiry_date,
        "Vendor.vendor_id": vendor_id,
        "Category.category_id": category_id,
        "Manager.manager_id": manager_id,
        "Domain.domain_id": domain_id,
    } = req.body;
    const user = req.user;

    try {
        if (
            !title ||
            !expiry_date ||
            !vendor_id ||
            !category_id ||
            !manager_id ||
            !domain_id
        )
            return res.status(400).send({ error: "All fields are required" });

        let status_id = 1;
        const today = new Date();
        const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));
        if (new Date(expiry_date) < oneMonthFromNow) status_id = 2;

        let license = await License.create({
            title,
            expiry_date,
            vendor_id,
            category_id,
            status_id,
            user_id: user.user_id,
            manager_id,
            domain_id,
        });

        license = await License.findOne({
            where: { license_id: license.license_id },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "user_id",
                    "vendor_id",
                    "category_id",
                    "status_id",
                    "manager_id",
                    "domain_id",
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Vendor,
                    attributes: ["vendor_name"],
                },
                {
                    model: Category,
                    attributes: ["category_name"],
                },
                {
                    model: Status,
                    attributes: ["status_name"],
                },
                {
                    model: Manager,
                    attributes: ["name", "email"],
                },
                {
                    model: Domain,
                    attributes: ["domain_name"],
                },
            ],
            raw: true,
            order: [["expiry_date", "ASC"]],
        });

        if (!license)
            return res
                .status(400)
                .send({ error: "License could not be created" });

        await Log.create({
            user_id: user.user_id,
            license_id: license.license_id,
            description: `License ${license.title} -- ${license["Vendor.vendor_name"]} created`,
            action_type: `Created by ${license["User.username"]}`,
        });
        return res.status(200).send({ license });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.deleteLicense = async (req, res) => {
    const { license_id } = req.body;
    try {
        const license = await License.destroy({ where: { license_id } });

        if (!license)
            return res.status(400).send({ error: "License not found" });

        return res.status(200).send({
            license: { license_id: license_id },
            message: "License Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.editLicense = async (req, res) => {
    const {
        license_id,
        title,
        expiry_date,
        "Vendor.vendor_id": vendor_id,
        "Category.category_id": category_id,
        "Manager.manager_id": manager_id,
        "Domain.domain_id": domain_id,
    } = req.body;
    const user_id = req.user.user_id;

    try {
        let license = await License.findOne({ where: { license_id } });

        if (!license)
            return res.status(404).send({ error: "License not found" });

        let status_id = 1;
        const today = new Date();
        const oneMonthFromNow = new Date(today.setMonth(today.getMonth() + 1));
        if (new Date(expiry_date) < oneMonthFromNow) status_id = 2;

        license.title = title;
        license.expiry_date = expiry_date;
        license.vendor_id = vendor_id;
        license.category_id = category_id;
        license.status_id = status_id;
        license.manager_id = manager_id;
        license.domain_id = domain_id;

        await license.save();

        license = await License.findOne({
            where: { license_id: license.license_id },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "user_id",
                    "vendor_id",
                    "category_id",
                    "status_id",
                    "manager_id",
                    "domain_id",
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Vendor,
                    attributes: ["vendor_name"],
                },
                {
                    model: Category,
                    attributes: ["category_name"],
                },
                {
                    model: Status,
                    attributes: ["status_name"],
                },
                {
                    model: Manager,
                    attributes: ["name", "email"],
                },
                {
                    model: Domain,
                    attributes: ["domain_name"],
                },
            ],
            raw: true,
            order: [["expiry_date", "ASC"]],
        });

        await Log.create({
            user_id: user_id,
            license_id: license.license_id,
            description: `License ${license.title} -- ${license["Vendor.vendor_name"]} updated`,
            action_type: `Updated by ${license["User.username"]}`,
        });

        return res.status(200).send({ license });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.checkExpiringLicenses = async () => {
    const licensesAboutToExpire = await License.findAll({
        where: {
            expiry_date: {
                [Op.lte]: new Date(
                    new Date().setDate(new Date().getDate() + 30)
                ), // Licenses expiring in 30 days
            },
        },
        include: [
            { model: User, attributes: ["email", "username"] },
            { model: Manager, attributes: ["email"] },
            { model: Category, attributes: ["category_name"] },
        ],
    });
    const superAdmin = await User.findOne({ where: { isSuperAdmin: true } });

    licensesAboutToExpire.forEach((license) => {
        const subject = `License Expiry Notification: ${license.title}`;
        const message = `
            <p>Dear All,</p>
            <p>This is to inform you that the following license <strong>${
                license.title
            }</strong> of category <strong>${
            license.Category.category_name
        }</strong>  is approaching its expiry date:</p>
            
            <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Title</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Category</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Manager</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Expiry Date</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                        license.title
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                        license.Category.category_name
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                        license.Manager.email
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(
                        license.expiry_date
                    ).toLocaleDateString()}</td>
                </tr>
            </table>

            <p>Please take the necessary actions to renew before the expiry date.</p>
            <p>Thank you,</p>
            <p>License Management Team</p>
            <hr>
            <p style="font-size: 0.9em; color: #888;">This is an automated message, please do not reply.</p>
            <p style="font-size: 0.9em; color: #888;">&copy; ${new Date().getFullYear()} License Management System</p>
        `;
        sendNotificationEmail(
            [license.Manager.email, superAdmin.email],
            subject,
            message
        );
    });

    const allLicenses = await License.findAll();
    allLicenses.forEach((license) => {
        this.updateLicenseExpiry(license);
    });
};

module.exports.updateLicenseExpiry = async (license) => {
    const today = new Date();
    if (license.expiry_date < today) {
        license.status_id = (
            await Status.findOne({ where: { status_name: "Expired" } })
        ).status_id;
    } else if (
        license.expiry_date < new Date(today.setMonth(today.getMonth() + 1))
    ) {
        license.status_id = (
            await Status.findOne({ where: { status_name: "Near to Expiry" } })
        ).status_id;
    }

    await license.save();
};

module.exports.getLicExpiry = async (req, res) => {
    try {
        const { domain_id } = req.user;
        const licExpInWeek = await License.findAll({
            where: {
                expiry_date: {
                    [Op.gt]: new Date(), // Greater than today
                    [Op.lte]: new Date(
                        new Date().setDate(new Date().getDate() + 7)
                    ), // Less than or equal to 7 days from now
                },
                domain_id: domain_id,
            },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "user_id",
                    "vendor_id",
                    "category_id",
                    "status_id",
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Vendor,
                    attributes: ["vendor_name"],
                },
                {
                    model: Category,
                    attributes: ["category_name"],
                },
                {
                    model: Status,
                    attributes: ["status_name"],
                },
            ],
            raw: true,
        });

        const newLic = await License.findAll({
            order: [["createdAt", "ASC"]],
            where: {
                createdAt: {
                    [Op.gte]: new Date().setHours(0, 0, 0, 0),
                    [Op.lte]: new Date().setHours(23, 59, 59, 999),
                },
                domain_id: domain_id,
            },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "user_id",
                    "vendor_id",
                    "category_id",
                    "status_id",
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Vendor,
                    attributes: ["vendor_name"],
                },
                {
                    model: Category,
                    attributes: ["category_name"],
                },
                {
                    model: Status,
                    attributes: ["status_name"],
                },
            ],
            raw: true,
        });

        return res.status(200).send({ licExpInWeek, newLic });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
