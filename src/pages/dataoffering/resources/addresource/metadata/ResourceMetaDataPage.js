import ComponentGroup from "@/components/componentgroup/ComponentGroup.vue";
import DataUtils from "@/utils/dataUtils";
import dataUtils from "../../../../../utils/dataUtils";
import errorUtils from "../../../../../utils/errorUtils";
import validationUtils from "../../../../../utils/validationUtils";

export default {
    components: {
        ComponentGroup
    },
    data() {
        return {
            title: "",
            description: "",
            keywords: "",
            publisher: "",
            standardlicense: "",
            language: "",
            languageItems: [],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            readonly: false,
            onlyMetaData: false
        };
    },
    mounted: function () {
        this.loadLanguages();
    },
    methods: {
        async loadLanguages() {
            try {
                this.$data.languageItems = (await DataUtils.getLanguages());
            } catch (error) {
                errorUtils.showError(error, "Get languages");
            }
        },
        nextPage() {
            this.$emit('nextPage');
        },
        loadResource(resource, onlyMetaData) {
            this.$data.onlyMetaData = onlyMetaData;
            if (resource.title == "") {
                this.$refs.form.reset();
            } else {
                this.$data.title = resource.title;
                this.$data.description = resource.description;
                this.$data.language = resource.language.substring(resource.language.lastIndexOf("/") + 1);
                this.$data.keywords = dataUtils.arrayToCommaSeperatedString(resource.keywords);
                this.$data.standardlicense = resource.standardlicense;
                this.$data.publisher = resource.publisher;
            }
        }
    }
};
