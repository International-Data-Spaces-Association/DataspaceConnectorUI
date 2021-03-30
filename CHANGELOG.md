# Changelog
All notable changes to this project will be documented in this file.
(The major version of IDS-Configmanager and IDS-Configmanager-UI indicates compatibility)


## [4.0.0] - 2021-03-03

### Added
- Dashboard
- Create, update & delete IDS resources
- Create, update & delete Backend Connections
- Create, update & delete Brokers with connector registration/unregistration
- Create & view routes for data offers (still under construction)
- Change settings of connector & config model

## [5.0.0] - 2021-03-30

### Added
- Configure URL of UI backend & Configmanager with docker compose env variable
- Set UI title with docker compose env variable
- Data Consumption: receive connector resources
- Set website title to UI title
### Changes
- Use Roboto font
- Remove file type & data acceses dashboard cards
- Routes: don't show "Add ..." buttons on "show route"
### Fixes
- Escaping all api call parameters
- Eager loading of resource page tabs
- disable host check
- Implementation of new api for source- & file-types dashboard cards
- Fix settings validation problem
- Fix problem with read-only textfield of broker dialog
- Call updateResourceAtBroker on resource delete

