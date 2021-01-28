import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import IDSResourcesPage from "@/pages/dataoffering/resources/IDSResourcesPage.vue";
import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import RoutesPage from "@/pages/dataoffering/routes/RoutesPage.vue";
import AddRoutePage from "@/pages/dataoffering/routes/addroute/AddRoutePage.vue";
import BrokersPage from "@/pages/brokers/BrokersPage.vue";
import AppsPage from "@/pages/apps/AppsPage.vue";
import SettingsPage from "@/pages/settings/SettingsPage.vue";
import BackendConnectionsPage from "@/pages/dataoffering/backendconnections/BackendConnectionsPage.vue";

export default {
    getPageStructure() {
        return [{
                path: "dashboard",
                name: "Dashboard",
                icon: require('@/assets/images/dashboard_icon.png'),
                component: DashboardPage,
                subpages: []
            },
            {
                path: "wizzard",
                name: "Wizzard",
                icon: require('@/assets/images/wizzard_icon.png'),
                component: null,
                subpages: []
            }, {
                path: null,
                name: "Data Offering",
                icon: require('@/assets/images/offering_icon.png'),
                component: null,
                subpages: [{
                    path: "idresourcesoffering",
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
                    path: "routesoffering",
                    name: "Routes (Offering)",
                    component: RoutesPage,
                    subpages: [{
                        path: "addroute",
                        name: "Add Route",
                        component: AddRoutePage,
                        subpages: []
                    }, {
                        path: "editroute",
                        name: "Edit Route",
                        component: AddRoutePage,
                        subpages: []
                    }]
                }]
            }, {
                path: null,
                name: "Data Consumation",
                icon: require('@/assets/images/consumation_icon.png'),
                component: null,
                subpages: [{
                    path: "idsresourcesconsumation",
                    name: "IDS Resources (Consumation)",
                    component: IDSResourcesPage
                }, {
                    path: "backendconnectionsconsumation",
                    name: "Backend Connections (Consumation)",
                    component: null
                }, {
                    path: "routesconsumation",
                    name: "Routes (Consumation)",
                    component: null
                }]
            }, {
                path: "brokers",
                name: "Brokers",
                icon: require('@/assets/images/broker_icon.png'),
                component: BrokersPage,
                subpages: []
            }, {
                path: "apps",
                name: "Apps",
                icon: require('@/assets/images/apps_icon.png'),
                component: AppsPage,
                subpages: []
            }, {
                path: "settings",
                name: "Settings",
                icon: require('@/assets/images/settings_icon.png'),
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
