<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({ drawer: null }),
};
</script>
<style>
@font-face {
  font-family: "Frutiger";
  src: local("Frutiger"),
    url(./assets/fonts/FrutigerLTCom-Roman.ttf) format("truetype");
}
.v-application {
  font-family: Frutiger !important;
  color: var(--v-text1-base) !important;
}

.v-application a {
  color: var(--v-text1-base) !important;
}

.v-application .primary--text {
  color: var(--v-text1-base) !important;
  caret-color: var(--v-text1-base) !important;
}

.primary--text {
  color: var(--v-text1-base) !important;
  caret-color: var(--v-text1-base) !important;
}

.v-card {
  color: var(--v-primary-base) !important;
}

.theme--light.v-card > .v-card__text,
.theme--light.v-card .v-card__subtitle {
  color: var(--v-text1-base) !important;
}

.v-label {
  color: var(--v-text1-base) !important;
}

.v-btn__content {
  color: var(--v-lighttext-base) !important;
}

.v-data-table span {
  color: var(--v-text1-base) !important;
}

.v-data-footer {
  color: var(--v-text1-base) !important;
}

.v-select__selection--comma {
  color: var(--v-text1-base) !important;
}

.v-list-item__title {
  color: var(--v-text1-base) !important;
}
</style>
