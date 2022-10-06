import PolicyLine from "@/components/policy/PolicyLine.vue";
import { VBtn, VContainer } from "vuetify/lib/components";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import {VCard, VCheckbox, VCardTitle, VList, VListItem, VListItemContent, VListItemSubtitle,
    VForm, VCardText, VDatePicker, VMenu, VTextField } from "vuetify/lib/components";
import validationUtils from "@/utils/validationUtils";

export default {
    components: {
        PolicyLine,
        VBtn,
        VContainer,
        VCard,
        VCardTitle,
        VList,
        VListItem,
        VListItemContent,
        VListItemSubtitle,
        VForm,
        VCardText,
        VDatePicker,
        VMenu,
        VCheckbox,
        VTextField
    },
    data() {
        return {
            newTemplateTitle: "",
            valid: false,
            policyLines: [],
            readonly: false,
            allContracts: [],
            policyTemplateTitles: [],
            policyTemplateName: "",
            saveAsTemplate: false,
            contractPeriodValid: false,
            contractPeriodFromMenu: false,
            contractPeriodFromValue: null,
            contractPeriodToMenu: false,
            contractPeriodToValue: null,
            defaultRule: validationUtils.getRequiredRule()
        };
    },
    mounted: function () {
        this.getAllContracts();
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        this.$data.policyLines.push({
            "name": Date.now()
        });
    },
    watch: {
        contractPeriodValid: function () {
            this.validationChanged();
        },
    },
    methods: {
        async getAllContracts() {
            try {
                this.$data.allContracts = await dataUtils.getAllPolicyTemplates();
                for ( let templateName of this.$data.allContracts) {
                    this.$data.policyTemplateTitles.push({
                        templateId: templateName.id,
                        templateName: templateName.title
                    })
                }
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            } catch (error) {
                errorUtils.showError(error, "Get policy templates");
            }
        },
        async applyTemplateDetails() {
            this.$data.policyLines = [];
            for ( let templateName of this.$data.allContracts) {
                if(templateName.title === this.$data.policyTemplateName) {
                    this.$data.contractPeriodFromValue = new Date(templateName.contractStart).toISOString().substring(0,10);
                    this.$data.contractPeriodToValue = new Date(templateName.contractEnd).toISOString().substring(0,10);
                    let contractRules = await dataUtils.getRules(templateName.rules);
                    for (let i = 0; i < contractRules.policyNames.length; i++) {
                        let policyLine = {
                            "name": Date.now() + i,
                            "policyName": contractRules.policyNames[i],
                            "ruleId": contractRules.ruleIds[i],
                            "ruleJson": contractRules.ruleJsons[i]
                        };
                        this.$data.policyLines.push(policyLine);
                    }
                }
            }
        },
        addPolicy() {
            this.$data.policyLines.push({
                "name": Date.now()
            });
        },
        removePolicy(name) {
            let index = -1;
            for (let i = 0; i < this.$data.policyLines.length; i++) {
                if (this.$data.policyLines[i].name === name) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.$data.policyLines.splice(index, 1);
            }
            this.validationChanged();
        },
        validationChanged() {
            for (let policyLine of this.$data.policyLines) {
                if (this.$refs[policyLine.name] !== undefined) {
                    this.$data.valid = this.$refs[policyLine.name][0].isValid() && this.$data.contractPeriodValid;
                    if (!this.$data.valid) {
                        break;
                    }
                }
            }
        },
        gotVisible() {
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        },
        loadResource(resource) {
            this.$data.policyLines = [];
            if (resource.id === -1) {
                // resource.id === -1 means this is a new IDS Endpoint node at the route page.
                // For this new node one policy line is added, so the user can save the first click on "+".
                this.$data.policyLines.push({
                    "name": Date.now()
                });
            } else {
                if (resource.policyNames !== undefined) {
                    for (let i = 0; i < resource.policyNames.length; i++) {
                        let policyLine = {
                            "name": Date.now() + i,
                            "ruleId": resource.ruleIds[i],
                            "ruleJson": resource.ruleJsons[i],
                            "policyName": resource.policyNames[i]
                        };

                        this.$data.policyLines.push(policyLine);
                    }
                } else if (resource.policyDescriptions !== undefined) {
                    for (let i = 0; i < resource.policyDescriptions.length; i++) {
                        let policyLine = {
                            "name": Date.now() + i,
                            "policyDescription": resource.policyDescriptions[i]
                        };
                        this.$data.policyLines.push(policyLine);
                    }
                }
                this.$data.newTemplateTitle = resource.contractName;
                if(this.$data.newTemplateTitle){
                    this.$data.saveAsTemplate = true;
                }
                this.$data.contractPeriodFromValue = resource.contractPeriodFromValue;
                this.$data.contractPeriodToValue = resource.contractPeriodToValue;
            }
        },
        async loadRequestedResource(resource) {
            this.$data.policyLines = [];
            let agreements = await dataUtils.getArtifactAgreements(resource.artifactId);
            if (agreements.length > 0) {
                let agreement = JSON.parse(agreements[0].value);
                this.$data.contractPeriodFromValue = agreement["ids:contractStart"]["@value"].substring(0, 10);
                this.$data.contractPeriodToValue = agreement["ids:contractEnd"]["@value"].substring(0, 10);
                let i = 0;
                for (let permission of agreement["ids:permission"]) {
                    permission["@context"] = {
                        "ids": "https://w3id.org/idsa/core/",
                        "idsc": "https://w3id.org/idsa/code/"
                    };
                    let policyName = await dataUtils.getPolicyNameByPattern(JSON.stringify(permission));
                    let policyLine = {
                        "name": Date.now() + i,
                        "ruleJson": permission,
                        "policyName": policyName
                    };
                    this.$data.policyLines.push(policyLine);
                    i++;
                }
            }
        },
        getUniqueName(allContracts, name){
            for (let templateName of allContracts) {
                if (templateName.title === name){
                    return this.getUniqueName(allContracts, name+"(1)");
                }
            }
            return name;
        },
        getTemplateTitle() {
            if (this.$data.saveAsTemplate) {
                this.$data.newTemplateTitle = this.getUniqueName(this.$data.allContracts, this.$data.newTemplateTitle);
                return this.$data.newTemplateTitle;
            }
            else {
                return "";
            }
        },
        getDescriptions() {
            let descriptions = [];
            for (let policyLine of this.$data.policyLines) {
                descriptions.push(this.$refs[policyLine.name][0].getDescription());
            }
            return descriptions;
        },
        getContractPeriodFromValue() {
            return this.$data.contractPeriodFromValue + "T00:00:00Z";
        },
        getContractPeriodToValue() {
            return this.$data.contractPeriodToValue + "T00:00:00Z";
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
        },
    }
};
