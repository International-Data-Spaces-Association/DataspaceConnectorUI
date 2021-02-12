import dataUtils from "@/utils/dataUtils";

export default {
    createResource(id, title, description, language, keywords, version, standardlicense, publisher, contract, sourceType) {
        let resource = {};
        if (id === undefined) {
            resource.id = "";
        } else {
            resource.id = id;
        }
        if (title === undefined) {
            resource.title = "";
        } else {
            resource.title = title;
        }
        if (description === undefined) {
            resource.description = "";
        } else {
            resource.description = description;
        }
        if (language === undefined) {
            resource.language = "";
        } else {
            resource.language = language;
        }
        if (keywords === undefined) {
            resource.keywords = [];
        } else {
            resource.keywords = keywords;
        }
        if (version === undefined) {
            resource.version = "";
        } else {
            resource.version = version;
        }
        if (standardlicense === undefined) {
            resource.standardlicense = "";
        } else {
            resource.standardlicense = standardlicense;
        }
        if (publisher === undefined) {
            resource.publisher = "";
        } else {
            resource.publisher = publisher;
        }
        if (contract === undefined) {
            resource.contract = "";
            resource.policyName = "";
        } else {
            resource.contract = contract;
            resource.policyName = dataUtils.convertTypeToPolicyName(contract["@type"]);
        }
        if (sourceType === undefined) {
            resource.sourceType = "";
        } else {
            resource.sourceType = sourceType;
        }
        return resource;
    },

    convertIdsResource(idsResource) {
        console.log(">>> CONVERT: ", idsResource);
        let standardLicense = undefined;
        if (idsResource["ids:standardLicense"] !== undefined) {
            standardLicense = idsResource["ids:standardLicense"]["@id"];
        }
        let publisher = undefined;
        if (idsResource["ids:publisher"] !== undefined) {
            publisher = idsResource["ids:publisher"]["@id"];
        }

        return this.createResource(idsResource["@id"], idsResource["ids:title"][0]["@value"], idsResource["ids:description"][0]["@value"],
            idsResource["ids:language"][0]["@id"].replace("idsc:", ""), idsResource["ids:keyword"][0]["@value"],
            idsResource["ids:version"], standardLicense, publisher,
            idsResource["ids:contractOffer"][0], idsResource["ids:representation"][0]["ids:sourceType"]);
    }
}
