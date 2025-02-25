const { Domain } = require("../models/index");

const getDescendantDomains = async (domainId, descendants = []) => {
    if(!domainId) {
        return descendants;
    }
    const children = await Domain.findAll({
        where: { parent_domain_id: domainId },
    });

    for (const child of children) {
        descendants.push(child.domain_id);
        await getDescendantDomains(child.domain_id, descendants);
    }
    return descendants;
};

module.exports = { getDescendantDomains }