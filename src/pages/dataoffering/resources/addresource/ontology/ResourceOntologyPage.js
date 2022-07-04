import ComponentGroup from "@/components/componentgroup/ComponentGroup.vue";
import dataUtils from "../../../../../utils/dataUtils";
import validationUtils from "../../../../../utils/validationUtils";

export default {
    components: {
        ComponentGroup
    },
    data() {
        return {
            ontologyVal: {},
            formValues: {},
            valid: false,
            readonly: false,
            ontology: '',
            onlyMetaData: false,
        };
    },
    async mounted () {
        this.getOntology();
    },
    methods: {
        gotVisible() {
        },
        defaultRule(required) {
            if (required === true) {
                return validationUtils.getRequiredRule();
            } else {
                return [];
            }
        },
        async optionSelected(identifier,selectedEntry){
            for (const element of this.$data.ontology.select){
                if(element.identifier === identifier){
                    for (const category of element.categories){
                        if (category.title === selectedEntry){
                            this.$set(this.ontologyVal, element.identifier, {
                                'subcategories': category.subcategories
                            });
                        }
                    }
                }
            }
        },
        async getOntology() {
            this.$data.ontology = await dataUtils.getOntology();
            for(const element of this.$data.ontology.select){
                this.$set(this.ontologyVal, element.identifier, {
                    'subcategories': []
                });

                //Add blank element, if not required
                if(element.required === false){
                    element.categories.unshift([]);
                }

                //Add blank element, if not required
                if(element.required_children === false){
                    for(const category of element.categories){
                        if(Array.isArray(category.subcategories) && category.subcategories.length > 0){
                            category.subcategories.unshift([]);
                        }
                    }
                }
            }
        },
        loadResource(resource, onlyMetaData) {
            this.$data.onlyMetaData = onlyMetaData;
            for (const element of this.$data.ontology.select){
                if (resource.additional[element.identifier] !== undefined){
                    for (const category of element.categories){
                        if (category.title === resource.additional[element.identifier]){
                            this.$set(this.ontologyVal, element.identifier, {
                                'subcategories': category.subcategories
                            });
                        }
                    }
                }
            }

            this.$data.formValues = resource.additional;
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage');
        },
    }
};
