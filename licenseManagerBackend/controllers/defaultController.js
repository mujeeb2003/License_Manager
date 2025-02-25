const {
    Category,
    Vendor,
    License,
    Log,
    Manager,
    Domain,
    DomainManager,
    DomainVendor,
} = require("../models/index.js");
const syslog = require("syslog-client");
const { Op } = require("sequelize");
const { getDescendantDomains } = require("../utils/getDescendantDomain.js");
// const client = syslog.createClient("localhost", { port: 514 }); // Create syslog client

module.exports.getLicenseopt = async (req, res) => {
    try {
        const { isAdmin, isSuperAdmin, domain_id } = req.user;
        const descendantDomains = await getDescendantDomains(domain_id);
        descendantDomains.push(domain_id);

        let categories, vendors, managers, domains;

        if (isSuperAdmin) {
            categories = await Category.findAll();
            vendors = await Vendor.findAll({
                include: [Domain],
            });
            managers = await Manager.findAll({
                include: [Domain],
            });
            domains = await Domain.findAll();
        } else {
            categories = await Category.findAll();
            vendors = await Vendor.findAll({
                include: [
                    {
                        model: Domain,
                        where: {
                            domain_id: { [Op.in]: [...descendantDomains] },
                        },
                    },
                ],
            });
            managers = await Manager.findAll({
                include: [
                    {
                        model: Domain,
                        where: {
                            domain_id: { [Op.in]: [...descendantDomains] },
                        },
                    },
                ],
            });
            domains = await Domain.findAll({
                where: {
                    domain_id: { [Op.in]: [...descendantDomains] }
                },
            });
            // console.log(domains);
            domains.map(async (domain) => {
                if (domain.dataValues.parent_domain_id) {
                    const parentDomain = await Domain.findOne({
                        where: {
                            domain_id: domain.dataValues.parent_domain_id,
                        },
                    });
                    domains.push(parentDomain);
                }
            });
        }
        // console.log(JSON.stringify(categories), JSON.stringify(vendors), JSON.stringify(managers), JSON.stringify(domains));
        return res.status(200).send({ categories, vendors, managers, domains });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.createVendor = async (req, res) => {
    const {
        vendor_name,
        vendor_email,
        vendor_representative,
        vendor_rep_phone,
        vendor_rep_email,
        domain_ids,
    } = req.body;

    try {
        if (
            !vendor_name ||
            !vendor_email ||
            !vendor_representative ||
            !vendor_rep_phone ||
            !vendor_rep_email ||
            !domain_ids ||
            !domain_ids.length
        )
            return res.status(400).send({ error: "All fields are required" });

        const vendor = await Vendor.create({
            vendor_name,
            vendor_email,
            vendor_representative,
            vendor_rep_phone,
            vendor_rep_email,
        });

        if (!vendor)
            return res.status(400).send({ error: "Vendor not created" });

        // Create domain vendor associations
        const domainVendorAssociations = domain_ids.map((domain_id) => ({
            domain_id,
            vendor_id: vendor.vendor_id,
        }));

        await DomainVendor.bulkCreate(domainVendorAssociations);

        // Fetch the created manager with domains
        const vendorWithDomains = await Vendor.findOne({
            where: { vendor_id: vendor.vendor_id },
            include: [Domain],
        });

        return res.status(200).send({ vendor: vendorWithDomains });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.createCategory = async (req, res) => {
    const { category_name } = req.body;

    try {
        const category = await Category.create({ category_name });

        if (!category)
            return res.status(400).send({ error: "Category not creted" });

        return res.status(200).send({ category });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.deleteVendor = async (req, res) => {
    const { vendor_id } = req.body;
    try {
        const license = await License.findOne({ where: { vendor_id } });

        if (license)
            return res
                .status(400)
                .send({ error: "Cannot Delete Vendor, Vendor has licenses" });

        const vendor = await Vendor.destroy({ where: { vendor_id } });

        if (!vendor) return res.status(400).send({ error: "Vendor not found" });

        return res.status(200).send({
            vendor: { vendor_id: vendor_id },
            message: "Vendor Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.deleteCategory = async (req, res) => {
    const { category_id } = req.body;
    try {
        const license = await License.findOne({ where: { category_id } });

        if (license)
            return res.status(400).send({
                error: "Cannot Delete Category, Category has licenses",
            });

        const category = await Category.destroy({ where: { category_id } });

        if (!category)
            return res.status(400).send({ error: "Category not found" });

        return res.status(200).send({
            category: { category_id: category_id },
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.editVendor = async (req, res) => {
    const {
        vendor_id,
        vendor_name,
        vendor_email,
        vendor_representative,
        vendor_rep_phone,
        vendor_rep_email,
        domain_ids,
    } = req.body;
    const user_id = req.user.user_id;

    try {
        let vendor = await Vendor.findOne({ where: { vendor_id } });

        if (!vendor) return res.status(404).send({ error: "Vendor not found" });

        (vendor.vendor_name = vendor_name),
            (vendor.vendor_email = vendor_email),
            (vendor.vendor_representative = vendor_representative),
            (vendor.vendor_rep_phone = vendor_rep_phone),
            (vendor.vendor_rep_email = vendor_rep_email);

        await vendor.save();

        // Update domain associations if domain_ids are provided
        if (domain_ids && domain_ids.length) {
            // Remove all existing domain associations
            await DomainVendor.destroy({
                where: { vendor_id },
            });

            // Create new domain manager associations
            const domainVendorAssociations = domain_ids.map((domain_id) => ({
                domain_id,
                vendor_id,
            }));

            await DomainVendor.bulkCreate(domainVendorAssociations);
        }

        // Fetch updated manager with domains
        const updatedVendor = await Vendor.findOne({
            where: { vendor_id },
            include: [Domain],
        });

        return res.status(200).send({ vendor: updatedVendor });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.editCategory = async (req, res) => {
    const { category_id, category_name } = req.body;
    const user_id = req.user.user_id;

    try {
        let category = await Category.findOne({ where: { category_id } });

        if (!category)
            return res.status(404).send({ error: "Category not found" });

        category.category_name = category_name;

        await category.save();

        return res.status(200).send({ category });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.createManager = async (req, res) => {
    const { name, email, domain_ids } = req.body;
    try {
        if (!name || !email || !domain_ids || !domain_ids.length)
            return res.status(400).send({ error: "All fields are required" });

        Manager.findOne({ where: { email } }).then((manager) => {
            if (manager) {
                return res.status(400).send({ error: "Manager with same email already exists" });
            }
        });

        const manager = await Manager.create({ name, email });

        if (!manager)
            return res.status(400).send({ error: "Manager not created" });

        // Create domain manager associations
        const domainManagerAssociations = domain_ids.map((domain_id) => ({
            domain_id,
            manager_id: manager.manager_id,
        }));

        await DomainManager.bulkCreate(domainManagerAssociations);

        // Fetch the created manager with domains
        const managerWithDomains = await Manager.findOne({
            where: { manager_id: manager.manager_id },
            include: [Domain],
        });

        return res.status(200).send({ manager: managerWithDomains });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.editManager = async (req, res) => {
    const { manager_id, name, email, domain_ids } = req.body;

    try {
        let manager = await Manager.findOne({ where: { manager_id } });

        if (!manager)
            return res.status(404).send({ error: "Manager not found" });

        // Update basic manager info
        manager.name = name;
        manager.email = email;

        await manager.save();

        // Update domain associations if domain_ids are provided
        if (domain_ids && domain_ids.length) {
            // Remove all existing domain associations
            await DomainManager.destroy({
                where: { manager_id },
            });

            // Create new domain manager associations
            const domainManagerAssociations = domain_ids.map((domain_id) => ({
                domain_id,
                manager_id,
            }));

            await DomainManager.bulkCreate(domainManagerAssociations);
        }

        // Fetch updated manager with domains
        const updatedManager = await Manager.findOne({
            where: { manager_id },
            include: [Domain],
        });

        return res.status(200).send({ manager: updatedManager });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.createDomain = async (req, res) => {
    const { domain_name, parent_domain_id } = req.body;
    try {
        if (!domain_name)
            return res.status(400).send({ error: "Domain Name is required" });

        const domain = await Domain.create({
            domain_name,
            parent_domain_id: parent_domain_id === 0 ? null : parent_domain_id,
        });

        if (!domain)
            return res.status(400).send({ error: "Domain not created" });

        return res.status(200).send({ domain });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.editDomain = async (req, res) => {
    const { domain_name, parent_domain_id, domain_id } = req.body;
    console.log(domain_name, parent_domain_id, domain_id);
    try {
        if (!domain_name)
            return res.status(400).send({ error: "Domain Name is required" });

        const domain = await Domain.findByPk(domain_id);

        if (!domain) return res.status(400).send({ error: "Domain not found" });

        {
            domain_name && (domain.domain_name = domain_name);
        }
        {
            domain.parent_domain_id =
                parent_domain_id === 0 ? null : parent_domain_id;
        }

        await domain.save();

        return res.status(200).send({ domain });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports.deleteDomain = async (req, res) => {
    const { domain_id } = req.body;
    try {
        const domain = await Domain.findByPk(domain_id);

        if (!domain) return res.status(400).send({ error: "Domain not found" });

        await domain.destroy();

        return res.status(200).send({
            domain: { domain_id: domain_id },
            message: "Domain Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// module.exports.sendLogsToSyslog = async function sendLogsToSyslog() {
//     try {
//         // Get logs from the last 3 months
//         const logs = await Log.findAll({
//             where: { createdAt: { [Op.gte]: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) } }
//         });

//         // Send logs to Syslog server
//         logs.forEach(log => {
//             const logMessage = `ID: ${log.log_id}, Message: ${log.description}, Time: ${log.createdAt}`;

//             // Sending the log to syslog
//             client.log(logMessage, { facility: syslog.Facility.Local0, severity: syslog.Severity.Informational }, (error) => {
//                 if (error) {
//                     console.error('Error sending log to syslog:', error);
//                 }
//             });
//         });

//         console.log('Logs successfully sent to Syslog');

//         // Optionally clean up old logs after sending
//         await cleanupOldLogs();

//     } catch (error) {
//         console.error('Error while sending logs to Syslog:', error);
//     }
// };

// // Cleanup function to remove old logs
// async function cleanupOldLogs() {
//     try {
//         // Delete logs older than 3 months
//         await Log.destroy({
//             where: { createdAt: { [Op.lt]: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) } }
//         });
//         console.log('Old logs successfully deleted');
//     } catch (error) {
//         console.error('Error cleaning up logs:', error);
//     }
// }
