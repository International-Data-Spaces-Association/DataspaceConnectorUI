<template>
  <div class="content">
    <div class="text-h5 header-text">
      Dashboard
    </div>
    <v-row>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <data-sources-card></data-sources-card>
      </v-col>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <policy-templates-card></policy-templates-card>
      </v-col>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <offered-resources-card></offered-resources-card>
      </v-col>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <active-contracts-card></active-contracts-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <file-types-card></file-types-card>
      </v-col>
      <v-col
          cols="12"
          sm="12"
          md="3"
          class="d-flex"
      >
        <own-url-card></own-url-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OfferedResourcesCard from "@/components/cards/offeredresources/OfferedResourcesCard.vue";
import PolicyTemplatesCard from "@/components/cards/policytemplates/PolicyTemplatesCard.vue";
import DataSourcesCard from "@/components/cards/datasources/DataSourcesCard.vue";
import ActiveContractsCard from "@/components/cards/activecontracts/ActiveContractsCard.vue";
import FileTypesCard from "@/components/cards/filetypes/FileTypesCard.vue";
import OwnUrlCard from "@/components/cards/ownurlcard/OwnUrlCard.vue";

export default {
  components: {
    FileTypesCard,
    OfferedResourcesCard,
    PolicyTemplatesCard,
    DataSourcesCard,
    ActiveContractsCard,
    OwnUrlCard
  },
  data() {
    return {};
  },
};
</script>
