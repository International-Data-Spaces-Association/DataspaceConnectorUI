import MainLayout from "@/pages/mainlayout/MainLayout.vue";
import PageStructure from "@/pages/PageStructure";
import Dsc from "@/pages/dsc/Dsc"

const routes = [{
  path: "/",
  component: MainLayout,
  redirect: "/dashboard",
  children: getRoutes()
}];

function getRoutes() {
  var pageStructure = PageStructure.getPageStructure();

  var routes = [];
  var currentBreadcrumb = [];
  generateRoutes(pageStructure, routes, currentBreadcrumb, null);
  return routes;
}

function generateRoutes(pageStructure, routes, currentBreadcrumb, parent) {
  for (let page of pageStructure) {
    currentBreadcrumb.push({
      text: PageStructure.getDisplayName(page.name),
      href: page.path
    });
    if (page.path != null) {
      routes.push({
        path: page.path,
        name: page.name,
        component: page.component,
        meta: {
          breadcrumb: currentBreadcrumb.map((x) => x),
          parent: parent
        }
      });
    }

    if (page.subpages !== undefined) {
      generateRoutes(page.subpages, routes, currentBreadcrumb, page);
    }
    currentBreadcrumb.pop();
  }

  // TODO REMOVE (just for testing DSC API calls)
  routes.push({
    path: "dsc",
    name: "DSC",
    component: Dsc
  });
}

export default routes;
