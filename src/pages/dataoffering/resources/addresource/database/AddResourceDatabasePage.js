import FileUpload from "@/components/fileupload/FileUpload.vue";

export default {
    components: {
        FileUpload
    },
    data() {
        return {
            jdbcURL: null,
            dbType: null,
            username: null,
            password: null,
            showPassword: false,
        };
    },
    mounted: function () {},
    methods: {}
}
