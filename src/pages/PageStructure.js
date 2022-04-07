import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import IDSResourcesPage from "@/pages/dataoffering/resources/IDSResourcesPage.vue";
import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import RoutesPage from "@/pages/dataoffering/routes/RoutesPage.vue";
import AddRoutePage from "@/pages/dataoffering/routes/addroute/AddRoutePage.vue";
import IDSDataConsumptionPage from "@/pages/dataconsumption/dataconsumption/IDSDataConsumptionPage.vue";
import IDSResourcesPageConsumption from "@/pages/dataconsumption/resources/IDSResourcesPageConsumption.vue";
import BrokersPage from "@/pages/brokers/BrokersPage.vue";
import AppsPage from "@/pages/apps/AppsPage.vue";
import AppStoresPage from "@/pages/appstores/AppStoresPage.vue";
import InstallAppsPage from "@/pages/appstores/installapps/InstallAppsPage.vue";
import SettingsPage from "@/pages/settings/SettingsPage.vue";
import BackendConnectionsPage from "@/pages/backendconnections/BackendConnectionsPage.vue";
import SubscriptionsPage from "@/pages/subscriptions/SubscriptionsPage.vue";
import ResourceCatalogsPage from "@/pages/dataoffering/resources/addresource/catalog/ResourceCatalogsPage.vue";

export default {
    getPageStructure() {
        return [{
            path: "dashboard",
            name: "Dashboard",
            icon: "mdi-view-dashboard",
            component: DashboardPage,
            subpages: []
        },
        {
            path: null,
            name: "Data Offering",
            icon: "mdi-application-export",
            component: null,
            subpages: [{
                path: "idsresourcesoffering",
                name: "IDS Resources (Offering)",
                component: IDSResourcesPage,
                subpages: [{
                    path: "addresource",
                    name: "Add Resource",
                    component: AddResourcePage,
                    subpages: []
                }, {
                    path: "editresource",
                    name: "Edit Resource",
                    component: AddResourcePage,
                    subpages: []
                }]
            }, {
                path: "routesoffering",
                name: "Routes (Offering)",
                component: RoutesPage,
                subpages: [{
                    path: "addrouteoffering",
                    name: "Add Route (Offering)",
                    component: AddRoutePage,
                    subpages: []
                }, {
                    path: "showrouteoffering",
                    name: "Show Route (Offering)",
                    component: AddRoutePage,
                    subpages: []
                }]
            }, {
                path: "catalogsoffering",
                name: "Catalogs (Offering)",
                component: ResourceCatalogsPage,
                subpages: []
            }]
        }, {
            path: null,
            name: "Data Consumption",
            icon: "mdi-file-document-outline",
            component: null,
            subpages: [{
                path: "idsresourcesconsumption",
                name: "IDS Resources (Consumption)",
                component: IDSResourcesPageConsumption,
                subpages: [{
                    path: "requestresourceconsumption",
                    name: "Request Resource (Consumption)",
                    component: IDSDataConsumptionPage,
                    subpages: []
                }]
            }, {
                path: "routesconsumption",
                name: "Routes (Consumption)",
                component: RoutesPage,
                subpages: [{
                    path: "addrouteconsumption",
                    name: "Add Route (Consumption)",
                    component: AddRoutePage,
                    subpages: []
                }, {
                    path: "showrouteconsumption",
                    name: "Show Route (Consumption)",
                    component: AddRoutePage,
                    subpages: []
                }]
            }]
        }, {
            path: "backendconnections",
            name: "Backend Connections",
            icon: "mdi-database",
            component: BackendConnectionsPage
        }, {
            path: "subscriptions",
            name: "Subscriptions",
            icon: "mdi-rss",
            component: SubscriptionsPage
        }, {
            path: "brokers",
            name: "Brokers",
            icon: "mdi-briefcase-variant-outline",
            component: BrokersPage,
            subpages: []
        }, {
            path: "apps",
            name: "Apps",
            icon: "mdi-apps",
            component: AppsPage,
            subpages: []
        }, {
            path: "appstores",
            name: "App Stores",
            icon: "mdi-storefront-outline",
            component: AppStoresPage,
            subpages: [{
                path: "installapps",
                name: "Install apps",
                component: InstallAppsPage,
                subpages: [],
                showInMenu: false
            }]
        }, {
            path: "settings",
            name: "Settings",
            icon: "mdi-cog-outline",
            component: SettingsPage,
            subpages: []
        }
        ];
    },
    getDisplayName(name) {
        var displayName = name;
        if (displayName.indexOf('(') != -1) {
            displayName = displayName.substring(0, displayName.indexOf('('));
        }
        return displayName;
    }
}
