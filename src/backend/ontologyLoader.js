import fs from 'fs';
import util from 'util';
import N3 from 'n3';
import rdfParserImport from 'rdf-parse';
import {DataFactory} from 'rdf-data-factory';

const rdfParser = rdfParserImport.default;
const store = new N3.Store();
const factory = new DataFactory();

let config = null;
let DEBUG = false;

const ONTOLOGY_FILE = "ontology.ttl";
const CONFIG_FILE = "ontology.config.json";

const ELEMENT_SELECTTYPE_OBJECT = "http://www.w3.org/2002/07/owl#Class";
const ELEMENT_TEXTTYPE_OBJECT = "http://www.w3.org/2002/07/owl#DatatypeProperty";

const CATEGORY_IDENTIFIER_PREDICATE = "http://www.w3.org/2000/01/rdf-schema#range";

const ELEMENT_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const CATEGORY_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SUBCATEGORY_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const ELEMENT_LABEL_PREDICATE = "http://www.w3.org/2000/01/rdf-schema#label";
const CATEGORY_LABEL_PREDICATE = "http://www.w3.org/2000/01/rdf-schema#label"
const SUBCATEGORY_LABEL_PREDICATE = "http://www.w3.org/2000/01/rdf-schema#label";


if (process.env.DEBUG !== undefined && process.env.DEBUG === "true") {
    DEBUG = true;
}

async function loadOntology() {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    if (config == null) {
        console.error("No config available");
    }
    if (DEBUG === true) {
        console.log(config);
    }

    await importFile();
    if (DEBUG === true) {
        for (const quad of store) {
            console.log(quad);
        }
    }

    await buildSelectStructure();

    await buildTextStructure()

    if (DEBUG === true) {
        console.log(util.inspect(config, false, null, true /* enable colors */))
    }
}

function importFile() {
    return new Promise((resolve) => {
        try {
            const textStream = fs.createReadStream(ONTOLOGY_FILE);
            const quadStream = rdfParser.parse(textStream, {contentType: 'text/turtle'});
            store.import(quadStream).on('end', () => resolve());
        } catch (err) {
            console.error(err);
        }
    });
}

async function buildSelectStructure() {

    //Iterate over all select elements
    for (const element of config.select) {

        //Skip if category is not present in TTL
        if (!store.has(factory.namedNode(element.identifier), factory.namedNode(ELEMENT_PREDICATE), factory.namedNode(ELEMENT_SELECTTYPE_OBJECT))) {
            console.error("Identifier " + element.identifier + " not found");
            continue;
        }

        //Element identifier
        if (DEBUG === true) {
            console.log("Category identifier: " + element.identifier);
        }

        //Element title
        let titleQuad = store.getQuads(factory.namedNode(element.identifier), factory.namedNode(ELEMENT_LABEL_PREDICATE), null);
        element.title = titleQuad[0].object.value;
        if (DEBUG === true) {
            console.log("Category title: " + element.title);
        }

        //Subelement title
        if(element.identifier_children !== ""){
            titleQuad = store.getQuads(factory.namedNode(element.identifier_children), factory.namedNode(ELEMENT_LABEL_PREDICATE), null);
            element.title_children = titleQuad[0].object.value;
            if (DEBUG === true) {
                console.log("Subcategory title: " + element.title_children);
            }
        }

        //Categories
        if (DEBUG === true) {
            console.log("Category elements:");
        }
        element.categories = [];

        //Category Elements
        let categoryElements = store.getQuads(null, factory.namedNode(CATEGORY_PREDICATE), factory.namedNode(element.identifier));

        //Override class identifier with property identifier
        let elementIdentifier = store.getQuads(null, factory.namedNode(CATEGORY_IDENTIFIER_PREDICATE), factory.namedNode(element.identifier));
        element.identifier = elementIdentifier[0].subject.value;

        //Iterate over all Category Elements
        for (const quad of categoryElements) {
            let category = {};

            //Identifier
            category.identifier = quad.subject.value;
            if (DEBUG === true) {
                console.log("Category identifier: " + category.identifier);
            }

            //label
            let categoryElements2 = store.getQuads(factory.namedNode(category.identifier), factory.namedNode(CATEGORY_LABEL_PREDICATE), null);
            category.title = categoryElements2[0].object.value;
            if (DEBUG === true) {
                console.log("Category title: " + category.title);
            }

            //subcategories
            category.subcategories = [];
            let subcategories = store.getQuads(null, factory.namedNode(SUBCATEGORY_PREDICATE), factory.namedNode(category.identifier));

            for (const subcategory of subcategories) {
                let subcategoryElement = {};

                //subcategory identifier
                subcategoryElement.identifier = subcategory.subject.value;
                if (DEBUG === true) {
                    console.log("Subcategory identifier: " + subcategoryElement.identifier);
                }

                //subcategory title
                let subcategories = store.getQuads(subcategoryElement.identifier, factory.namedNode(SUBCATEGORY_LABEL_PREDICATE), null);
                subcategoryElement.title = subcategories[0].object.value;
                if (DEBUG === true) {
                    console.log("Subcategory title: " + subcategoryElement.title);
                }

                category.subcategories.push(subcategoryElement);

            }

            if (DEBUG === true) {
                console.log("-------------");
            }

            element.categories.push(category);
        }
    }
}

async function buildTextStructure() {

    //Iterate over all text elements
    for (const element of config.text) {

        //Skip category if not present in TTL
        if (!store.has(factory.namedNode(element.identifier), factory.namedNode(ELEMENT_PREDICATE), factory.namedNode(ELEMENT_TEXTTYPE_OBJECT))) {
            console.error("Identifier " + element.identifier + " not found");
            continue;
        }

        let elementTitle = store.getQuads(factory.namedNode(element.identifier), factory.namedNode(ELEMENT_LABEL_PREDICATE), null);
        element.title = elementTitle[0].object.value;
        if (DEBUG === true) {
            console.log("Element title: " + element.title);
        }
    }
}

function getOntology() {
    //If feature is disabled return empty arrays
    if (config == null || (process.env.USE_ONTOLOGY !== undefined && process.env.USE_ONTOLOGY === "false")) {
        return {
            "select": [],
            "text": []
        };
    }
    return config;
}

export default {loadOntology, getOntology};