import PageStructure from "@/pages/PageStructure";

export default {
  props: [],
  name: "navigation-menu",
  data() {
    return {
      items: this.getItems(),
      activeRoute: null
    }
  },
  mounted: function () {
    this.$data.activeRoute = this.$route;
  },
  watch: {
    $route() {
      this.$data.activeRoute = this.$route;
    },
  },
  methods: {
    getItems() {
      var items = [];
      for (let page of PageStructure.getPageStructure()) {
        if (page.showInMenu === undefined || page.showInMenu == true) {
          let subitems = undefined;
          if (page.subpages !== undefined && page.subpages.length > 0) {
            subitems = [];
            for (let subpage of page.subpages) {
              if (subpage.showInMenu === undefined || subpage.showInMenu == true) {
                subitems.push({
                  icon: subpage.icon,
                  title: PageStructure.getDisplayName(subpage.name),
                  to: subpage.path
                });
              }
            }
            if (subitems.length == 0) {
              subitems = undefined;
            }
          }

          items.push({
            icon: page.icon,
            title: page.name,
            to: page.path,
            subitems: subitems
          });
        }
      }
      return items;
    },
    isActive(item) {

      let active = false;
      if (this.$data.activeRoute != null) {
        if (item.to != null && item.to.replace("/", "") == this.$data.activeRoute.path.replace("/", "")) {
          active = true;
        } else if (this.$data.activeRoute.meta.parent != null && item.to != null && this.$data.activeRoute.meta.parent.path != null && item.to.replace("/", "") == this.$data.activeRoute.meta.parent.path.replace("/", "")) {
          active = true;
        }
      }
      return active;
    }
  }
}
