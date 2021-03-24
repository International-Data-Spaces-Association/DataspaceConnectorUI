<template>
  <div class="content">
    <offered-resources-card></offered-resources-card>
    <!-- <source-types-card></source-types-card> -->
    <file-types-card></file-types-card>
    <!-- <data-accesses-card></data-accesses-card> -->
  </div>
</template>

<script>
import OfferedResourcesCard from "@/components/cards/offeredresources/OfferedResourcesCard.vue";
// import SourceTypesCard from "@/components/cards/sourcetypes/SourceTypesCard.vue";
import FileTypesCard from "@/components/cards/filetypes/FileTypesCard.vue";
// import DataAccessesCard from "@/components/cards/dataaccesses/DataAccessesCard.vue";

export default {
  components: {
    OfferedResourcesCard,
    // SourceTypesCard,
    FileTypesCard,
    // DataAccessesCard,
  },
  data() {
    return {};
  },
};
</script>
