# Changelog
All notable changes to this project will be documented in this file.
(Skipped major version 1, 2 and 3 to match versioning of IDS DataSpaceConnector)

## [8.0.0] - XXX-XX-XX

### Added
- Columns "Creation date" & "keywords" in resource table

### Changes
- All API calls changed to DSC API

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

