# Changelog
All notable changes to this project will be documented in this file.
(Skipped major version 1, 2 and 3 to match versioning of IDS DataSpaceConnector)

## [8.4.0] - XXX-XX-XX

### Added
- Data Consumption: Show list of requested resources
- Backend Connections: API-Key authentication
- Resources: Set payment method

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

