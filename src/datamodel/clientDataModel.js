import dataUtils from "@/utils/dataUtils";

export default {
    createResource(id, title, description, language, keywords, version, standardLicense, publisher, contract, sourceType, representationId) {
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
        if (standardLicense === undefined) {
            resource.standardLicense = "";
        } else {
            resource.standardLicense = standardLicense;
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
            resource.policyName = dataUtils.convertDescriptionToPolicyName(contract["ids:permission"][0]["ids:description"][0]["@value"]);
        }
        if (sourceType === undefined) {
            resource.sourceType = "";
        } else {
            resource.sourceType = sourceType;
        }
        if (representationId === undefined) {
            resource.representationId = null;
        } else {
            resource.representationId = representationId;
        }
        return resource;
    },

    convertIdsResource(idsResource) {
        let standardLicense = undefined;
        if (idsResource["ids:standardLicense"] !== undefined) {
            standardLicense = idsResource["ids:standardLicense"]["@id"];
        }
        let publisher = undefined;
        if (idsResource["ids:publisher"] !== undefined) {
            publisher = idsResource["ids:publisher"]["@id"];
        }
        let contract = undefined;
        if (idsResource["ids:contractOffer"] !== undefined) {
            contract = idsResource["ids:contractOffer"][0];
        }
        let sourceType = undefined;
        let representationId = null;
        if (idsResource["ids:representation"] !== undefined) {
            sourceType = idsResource["ids:representation"][0]["https://w3id.org/idsa/core/sourceType"]["@value"];
            representationId = idsResource["ids:representation"][0]["@id"];
        }

        return this.createResource(idsResource["@id"], idsResource["ids:title"][0]["@value"], idsResource["ids:description"][0]["@value"],
            idsResource["ids:language"][0]["@id"].replace("idsc:", ""), idsResource["ids:keyword"][0]["@value"],
            idsResource["ids:version"], standardLicense, publisher,
            contract, sourceType,
            representationId);
    }
}
