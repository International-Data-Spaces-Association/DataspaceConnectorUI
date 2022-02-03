import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import IDSResourcesPage from "@/pages/dataoffering/resources/IDSResourcesPage.vue";
import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import IDSDataConsumptionPage from "@/pages/dataconsumption/dataconsumption/IDSDataConsumptionPage.vue";
import IDSResourcesPageConsumption from "@/pages/dataconsumption/resources/IDSResourcesPageConsumption.vue";
import BrokersPage from "@/pages/brokers/BrokersPage.vue";
import AppsPage from "@/pages/apps/AppsPage.vue";
import AppStoresPage from "@/pages/appstores/AppStoresPage.vue";
import InstallAppsPage from "@/pages/appstores/installapps/InstallAppsPage.vue";
import SettingsPage from "@/pages/settings/SettingsPage.vue";
import BackendConnectionsPage from "@/pages/dataoffering/backendconnections/BackendConnectionsPage.vue";
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
                path: "backendconnectionsoffering",
                name: "Backend Connections (Offering)",
                component: BackendConnectionsPage
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
                path: "backendconnectionsconsumption",
                name: "Backend Connections (Consumation)",
                component: null
            }]
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
