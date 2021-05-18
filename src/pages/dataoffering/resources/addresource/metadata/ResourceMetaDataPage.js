import ComponentGroup from "@/components/componentgroup/ComponentGroup.vue";
import DataUtils from "@/utils/dataUtils";
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
            version: "",
            language: "",
            languageItems: [],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            versionRule: validationUtils.getVersionRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            readonly: false
        };
    },
    mounted: function () {
        this.loadLanguages();
    },
    methods: {
        async loadLanguages() {
            this.$data.languageItems = (await DataUtils.getLanguages());
        },
        nextPage() {
            this.$emit('nextPage');
        },
        loadResource(resource) {
            if (resource.title == "") {
                this.$refs.form.reset();
            } else {
                this.$data.title = resource.title;
                this.$data.description = resource.description;
                this.$data.language = resource.language.substring(resource.language.lastIndexOf("/")+1);
                this.$data.keywords = resource.keywords;
                this.$data.version = resource.version;
                this.$data.standardlicense = resource.standardLicense;
                this.$data.publisher = resource.publisher;
            }
        }
    }
};
