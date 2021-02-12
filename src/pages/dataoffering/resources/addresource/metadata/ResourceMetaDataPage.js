import ComponentGroup from "@/components/componentgroup/ComponentGroup.vue";
import DataUtils from "@/utils/dataUtils";

export default {
    components: {
        ComponentGroup
    },
    props: ['readonly'],
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
            defaultRule: [
                v => !!v || 'This data is required'
            ],
            numberRule: [
                v => !!v || 'This data is required',
                v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
            ]
        };
    },
    mounted: function () {
        this.loadLanguages();
    },
    methods: {
        async loadLanguages() {
            DataUtils.getLanguages(languages => {
                this.$data.languageItems = languages;
            });
        },
        nextPage() {
            this.$emit('nextPage');
        },
        loadResource(resource) {
            this.$data.title = resource.title;
            this.$data.description = resource.description;
            this.$data.publisher = resource.publisher;
            this.$data.keywords = resource.keywords;
            this.$data.standardlicense = resource.standardLicense;
            this.$data.version = resource.version;
            this.$data.language = resource.language.replace("idsc:", "");
        },
        set(resource) {
            if (resource.title == "") {
                this.$refs.form.reset();
            } else {
                this.$data.title = resource.title;
                this.$data.description = resource.description;
                this.$data.language = resource.language;
                this.$data.keywords = resource.keywords;
                this.$data.version = resource.version;
                this.$data.standardlicense = resource.standardlicense;
                this.$data.publisher = resource.publisher;
            }
        }
    }
};
