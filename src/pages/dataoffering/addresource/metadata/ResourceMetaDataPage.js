import ComponentGroup from "@/components/componentgroup/ComponentGroup.vue";
import DataUtils from "@/utils/dataUtils";

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
            this.$data.title = resource["ids:title"][0]["@value"];
            this.$data.description = resource["ids:description"][0]["@value"];
            this.$data.publisher = resource["ids:publisher"]["@id"];
            this.$data.keywords = resource["ids:keyword"][0]["@value"];
            this.$data.standardlicense = resource["ids:standardLicense"]["@id"];
            this.$data.version = resource["ids:version"];
            this.$data.language = resource["ids:language"][0]["@id"].replace("idsc:", "");
        }
    }
};
