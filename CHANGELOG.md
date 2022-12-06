# Changelog
All notable changes to this project will be documented in this file.


## [10.2.2] - 2022-12-06

### Changed
- Updated Dependencies


## [10.2.1] - 2022-11-14

### Fixed
- EndpointDocumentation accessed on wrong IDS infomodel object level


## [10.2.0] - 2022-11-03

### Added
- Endpoint Documentation to Meta Data page

### Fixed
- Fixed the UI to get the active configuration of the DSC

### Changed
- renamed variable `standardlicense` to `standardLicense`


## [10.1.0] - 2022-10-06

### Fixed
- Log ontology if DEBUG is enabled
- Policy in Policy Template is doubled

### Removed
- entrypoint.sh now is a direct command in Dockerfile
- buildDockerImage.sh Instead use `sudo docker build -t dataspace-connector-ui .`

### Changed
- Renamed default title and description of UI
- Prevent adding contract templates with duplicate titles by adding "(1)" to its title


## [10.0.1] - 2022-08-19

### Added
- Connector ID adjustable via Settings page

### Fixed
- Inconsistent keyStore and trustStore variable naming between UI and DSC
- Ontology page view undefined on view of a specific resource
- Policy template checkbox not loaded correctly on view
- Button "Register data source" links to blank page
- Txt file upload with file larger than 1 MB failed. Set max file upload to 4 GB

### Removed
- Subtitle of dashboard page


## [10.0.0] - 2022-05-23 (compatible with DSC 7.1.0)
**_ATTENTION: This release requires at least DSC version 7.1.0, which introduces `addition` field in EndpointView. See [Changelog DSC v7.1.0](https://github.com/International-Data-Spaces-Association/DataspaceConnector/releases/tag/v7.1.0,changelog)_**

### Added
- Functionality to add custom properties to Resources (see [README.md](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI#add-custom-attributes-to-resources))
- Functionality to add a Basic Auth to protect the backend (see [README.md](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI#protect-backend-with-basic-auth))
- Functionality to set DeployMode of a Connector via Settings
- Functionality to manage whitelisted DAPS
- Dashboard card showing the configured default endpoint
- Dashboard card showing number of data sources
- Dashboard card showing number of policy templates
- Dashboard card showing number of data offerings
- Dashboard card showing number of active contracts
- Customizable background color of navigation via variable `navigationBackground`
- Health check in backend for kubernetes probes
- Title and description for data sources
- Templating for policies (Contract + Rules as templates)
- Advanced mode toggle (bottom of navigation bar) hiding in default's disabled mode several navigation bar elements
- Header shows connector description
- Check if a contract's validity time range fits to the current date, otherwise do not show buttons to request artifact
- Display title in backend connection remove dialog instead of URL
- Display title in backend connection select dialog

### Changed
- Several labels to explain functionalities simpler
- Navigation elements structure
- Adjusted shown fields in Add and Adjust popup for Backend Connections
- Colors of dropdown elements
- Sticky logo on small screens showing scroll bar in navigation
- Moved CSS styles from App.vue into separate default.css
- Updated package.json version number

### Fixed
- Screen refreshing when pressing enter in URL field at Data Consumption view
- Raised a broad range of comparisons of variables from value to type level
- Validation for database URLs does not require http prefix

### Removed
- Unused imports

### Dependencies
- @vue/cli-plugin-babel: 4.5.15 -> ^5.0.4
- @vue/cli-plugin-eslint: 4.5.15 -> ~5.0.0
- @vue/cli-service: ^4.5.15 -> ^5.-0.4
- eslint: ^6.7.2, -> ^7.32.0
- eslint-plugin-vue: ^6.2.2 -> ^8.0.3
- ADDED @babel/core: ^7.12.16
- ADDED @babel/eslint-parser: ^7.12.16

## [10.0.0] - 2022-07-04 (compatible with DSC 7.1.0)
**_ATTENTION: This release requires at least DSC version 7.1.0, which introduces `addition` field in EndpointView. See [Changelog DSC v7.1.0](https://github.com/International-Data-Spaces-Association/DataspaceConnector/releases/tag/v7.1.0,changelog)_**

### Added
- Functionality to add custom properties to Resources (see [README.md](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI#add-custom-attributes-to-resources))
- Functionality to add a Basic Auth to protect the backend (see [README.md](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI#protect-backend-with-basic-auth))
- Functionality to set DeployMode of a Connector via Settings
- Functionality to manage whitelisted DAPS
- Dashboard card showing the configured default endpoint
- Dashboard card showing number of data sources
- Dashboard card showing number of policy templates
- Dashboard card showing number of data offerings
- Dashboard card showing number of active contracts
- Customizable background color of navigation via variable `navigationBackground`
- Health check in backend for kubernetes probes
- Title and description for data sources
- Templating for policies (Contract + Rules as templates)
- Advanced mode toggle (bottom of navigation bar) hiding in default's disabled mode several navigation bar elements
- Header shows connector description
- Check if a contract's validity time range fits to the current date, otherwise do not show buttons to request artifact
- Display title in backend connection remove dialog instead of URL
- Display title in backend connection select dialog

### Changed
- Several labels to explain functionalities simpler
- Navigation elements structure
- Adjusted shown fields in Add and Adjust popup for Backend Connections
- Colors of dropdown elements
- Sticky logo on small screens showing scroll bar in navigation
- Moved CSS styles from App.vue into separate default.css
- Updated package.json version number

### Fixed
- Screen refreshing when pressing enter in URL field at Data Consumption view
- Raised a broad range of comparisons of variables from value to type level
- Validation for database URLs does not require http prefix
- Opening browser in dev mode on wrong URL (0.0.0.0 instead of localhost)
- Adjust image name to `dataspace-connector-ui`
- Add image source `https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI` to Dockerfile

### Removed
- Unused imports


## [9.3.0] - 2022-05-04 (compatible with DSC 7.x)

### Added
- Add IDS/Non-IDS subscription to requested resource
- Delete associated routes of generic endpoint on delete
- Keystore/Truststore alias on settings page

### Fixes
- Removed route selection for IDS subscription
- Breadcrumbs: remove null links
- Docker Image with Non-Root-User
- Delete representation & artifact when requested resource is deleted

## [9.2.0] - 2022-04-08 (compatible with DSC 7.0.0)

### Added
- Delete associated routes of apps on stop/delete
- Subscriptions page
- Data Consumption: Checkbox for subscription
- Data Consumption: Delete requested resource
- Data Consumption: Table column "subscribed"

### Fixes
- Route validation: Offering/Consumption routes need to end/start with artifact

## [9.1.0] - 2022-04-01 (compatible with DSC 7.0.0)

### Added
- Data Offering: Add local data resources
- Backend Connections: Source type "Other"
- Added route creator (Data Offering & Consumption) with apps
- Data Consumption: Dispatch data via routes
- Start/Stop apps

### Changes
- Moved "Backend Connections" to the top menu level

### Fixes
- Raised comparison of variable from value to type level
- Removed sensitive data in HTTP response
- Also delete docker container of app on delete

## [9.0.0] - 2022-02-07 (compatible with DSC 7.0.0)

### Added
- Data Offering: Add local file

### Changes
- Use new DSC v.7 API
- Brokers / App Stores: On edit show URL as label (instead of textfield)

### Fixes
- Data Consumption: No validation on resource meta data dialog
- Data Consumption: Show correct rules in contract dialog

## [8.8.1] - 2022-02-03 (compatible with DSC 6.5.3)

### Fixes
- Get connector URL from UI backend (env variables not working in frontend code)

# Known Issues
- [Issue 851](https://github.com/International-Data-Spaces-Association/DataspaceConnector/issues/851): When changing any settings, the keystore/truststore passwords are lost in the DSC. (Is fixed in DSC 7.0.0)

## [8.8.0] - 2022-01-27 (compatible with DSC 6.5.3)

### Added
- Data Consumption: Search for resources in the broker

### Fixes
- Route: Set contract period start/end on route creation

# Known Issues
- [Issue 851](https://github.com/International-Data-Spaces-Association/DataspaceConnector/issues/851): When changing any settings, the keystore/truststore passwords are lost in the DSC. (Is fixed in DSC 7.0.0)

## [8.7.0] - 2021-12-17 (compatible with DSC 6.5.3)

### Added
- Filter offered resources by catalog
- Set contract validity period for offered resources
- Data Consumption: Show all resources instead of catalogs after request
- Data Offering: Show agreements of resources

### Changes
- Use material icons in navigaiton menu

### Fixes
- Data Consumption: No validation on resource meta data dialog
- Data Consumption: getIdOfAgreement() fixed

## [8.6.0] - 2021-10-08 (compatible with DSC 6.5.2)

### Added
- Install apps from App Store
- Show installed apps on page "Apps"

## [8.5.1] - 2021-10-01

### Fixes
- Data consumption: show correct payment method of requested resource
- Catalogs: show catalog checkboxes only on "Add Resource" page

## [8.5.0] - 2021-09-30

### Added
- Create, update and delete app stores
- Manage catalogs
- Add resources to catalogs
- Settings: Radio buttons to use/not use proxy
- Settings: Show available DSC update

### Fixes
- Settings: Correct handling of proxy username/password (new DSC attribute to detect set authentication)
- Data consumption: wider contract dialog (fixes truncated date fields)
- Data offering: load resource with no route
- Data offering: block navigation menu while saving resource

## [8.4.0] - 2021-08-20

### Added
- Data Consumption: Show list of requested resources
- Backend Connections: API-Key authentication
- Resources: Set payment method
- Resources: Set referenced resources

### Fixes
- Data Consumption: Show download link to artifact of own connector

## [8.3.2] - 2021-08-17

### Fixes
- Connector username/password configurable via Docker environment variables (CONNECTOR_USER/CONNECTOR_PASSWORD)

## [8.3.1] - 2021-08-16

### Fixes
- Docker run: API calls to "/" instead of "localhost:8083"

## [8.3.0] - 2021-08-13

### Added
- Data Consumption: Receive catalogs/resources, contract agreement, artifact download

### Changes
- Prebuild user interface for docker image

### Fixes
- Create artifact with value:'' on resource creation

## [8.2.0] - 2021-07-30

### Added
- Multiple policies can be added to a resource

## [8.1.0] - 2021-07-28

### Added
- New policies "Connector Restricted Usage" & "Security Profile Restricted Usage"

### Fixes
- Configuration: Rename connectorEndpoint to defaultEndpoint
- UI backend: CORS fix

## [8.0.0] - 2021-07-21

### Added
- Columns "Creation date" & "keywords" in resource table

### Changes
- All API calls changed to DSC API
- Resources are added to a default catalog
- Settings: Loglevel & Connector Deploy Mode read-only

### Removed
- Column "description" in resource table

### Fixes
- Correct URL validation

## [7.1.0] - 2021-06-29

### Added
- Show route error list on page "Data Offering > Routes"

## [7.0.1] - 2021-06-17

### Fixes
- set correct IDS endpoint accessUrl

## [7.0.0] - 2021-05-26

### Added
- Snackbar for showing API call error (on bottom of page)
- Resources: broker column

### Fixes
- Use new app endpoint type names
- Add route: Remove empty border on resource representation page
- Use new resource policy operator names

### Changes
- Refactoring of dataUtils
- Use new resource contract API
- Routes: automatically select input/output of connectors
- Changes in enum values API
- Changed UI backend default port to 8083 (no more root needed)
- Add resource: only list brokers where connector is registered
- Design change on resource representation page

## [6.0.0] - 2021-03-29

### Added
- Client-side route validation
- File type & byte size in resource representation

### Fixes
- Addtional escaping of API call parameters
- False hiding of busy indicator

### Changes
- UI backend refactoring: using one generic API endpoint
- Remove source type from resource representation

## [5.0.0] - 2021-03-10

### Added
- Set UI title from connector data
- Data consumption: receive connector resources

### Fixes
- Escaping of API call parameters
- Settings validation problem
- Routes: flowchart fix for right-to-left connections

### Changes
- Major Change: Call /configmodel API for proxy settings

## [4.0.0] - 2021-03-03

### Added
- Dashboard
- Create, update & delete IDS resources
- Create, update & delete Backend Connections
- Create, update & delete Brokers with connector registration/unregistration
- Create & view routes for data offers (still under construction)
- Change settings of connector & config model

