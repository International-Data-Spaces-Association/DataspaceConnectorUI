import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import IDSResourcesPage from "@/pages/dataoffering/resources/IDSResourcesPage.vue";
import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import IDSDataConsumptionPage from "@/pages/dataconsumption/dataconsumption/IDSDataConsumptionPage.vue";
import IDSResourcesPageConsumption from "@/pages/dataconsumption/resources/IDSResourcesPageConsumption.vue";
import SettingsPage from "@/pages/settings/SettingsPage.vue";
import BackendConnectionsPage from "@/pages/dataoffering/backendconnections/BackendConnectionsPage.vue";
import ResourcePolicyPage from "@/pages/dataoffering/resources/addresource/policy/ResourcePolicyPage.vue";
import BrokersPage from "@/pages/brokers/BrokersPage.vue";
import AppsPage from "@/pages/apps/AppsPage.vue";
import AppStoresPage from "@/pages/appstores/AppStoresPage.vue";
import InstallAppsPage from "@/pages/appstores/installapps/InstallAppsPage.vue";

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
                name: "Offerings",
                component: IDSResourcesPage,
                subpages: [{
                    path: "addresource",
                    name: "New Offering",
                    component: AddResourcePage,
                    subpages: []
                }, {
                    path: "editresource",
                    name: "Edit Resource",
                    component: AddResourcePage,
                    subpages: []
                }]
            }, {
                path: "policytemplates",
                name: "Policy Templates",
                component: ResourcePolicyPage,
                subpages: []
            }]
        }, {
            path: null,
            name: "Data Consumption",
            icon: "mdi-file-document-outline",
            component: null,
            subpages: [{
                path: "resourcerequests",
                name: "Requests",
                component: IDSResourcesPageConsumption,
                subpages: [{
                    path: "requestresourceconsumption",
                    name: "Request Resource (Consumption)",
                    component: IDSDataConsumptionPage,
                    subpages: []
                }]
            }]
        }, {

                path: null,
                name: "IDS Ecosystem",
                icon: "mdi-briefcase-variant-outline",
                component: null,
                subpages: [
                   {
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
                        }
                        ]
                    },

                ]
            },
            {
            path: "settings",
            name: "Settings",
            icon: "mdi-cog-outline",
            component: null,
            subpages: [
                {
                    path: "general",
                    name: "General",
                    component: SettingsPage
                }, {
                    path: "backendconnectionsoffering",
                    name: "Data Sources",
                    component: BackendConnectionsPage
                }, {
                    path: "backendconnectionsconsumption",
                    name: "Data Sinks",
                    component: null
                },
                {
                    path: "brokers",
                    name: "Brokers",
                    icon: "mdi-briefcase-variant-outline",
                    component: BrokersPage,
                    subpages: []
                },]
        }
        ];
    },
    getDisplayName(name) {
        var displayName = name;
        if (displayName.indexOf('(') !== -1) {
            displayName = displayName.substring(0, displayName.indexOf('('));
        }
        return displayName;
    }
}
