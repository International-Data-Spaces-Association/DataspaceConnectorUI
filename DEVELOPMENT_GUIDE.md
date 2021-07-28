
# Development Guide

## Requirerments

  

*  [Maven 3.+](https://maven.apache.org)

*  [Java JDK 11](https://adoptopenjdk.net)

*  [Node 14.+](https://nodejs.org)

*  [Visual Studio Code](https://code.visualstudio.com/) (Recommended IDE)

## Clone Repositories

Dataspace Connector:
```bash 
git clone https://github.com/International-Data-Spaces-Association/DataspaceConnector.git
```

Dataspace Connector UI:
```bash 
git clone -b develop https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI.git
```

  

## Build & run Dataspace Connector

In root directory of project:
```bash 
mvn clean package
cd target/
java -Dfile.encoding=utf-8 -jar dataspace-connector-xy.jar
```
  
## Build & run Dataspace Connector UI

In root directory of project:
```bash 
npm install
npm start
```
The user interface is started in developement mode with Hot Reload.
This means that changes to the code can be made during runtime and are automatically rebuild and displayed in the UI.
In some cases Hot Reload does not work correctly. I.e. when adding a vue component of a new type to the HTML template, you will see an 'Unknown custom element' error. Then you need to stop the task and reastart the UI (npm start).

  

## Structure of the code

### `src/assets/`
Here you can place assets (images, fonts, ...) that you like to use for the UI.

------------
### `src/backend/`
This is the code of the UI backend. It is just a small node express server to receive API call from the UI and forward those call to the DataSpaceConnector. This is needed because of the Same-Origin-Policy.

------------
### `src/components/`
Reusable custom vue components.

------------
### `src/datamodel/`

Client data model. Data received from the DataSpaceConnector at API calls is converted into simple objects (UI data model).

------------
### `src/pages/`

Vue component representing the single pages of this UI.
The hierarchy of the files mirrors as much as possible the structure of the navigation menu.

------------
### `src/plugins/`
Vuetify configuration.
  
------------
### `src/routes/`
Configuration of the vue router to route browser URLs to vue components.
All routes are automatically generated from the page structure defined in `src/pages/PageStructure.js`.
In the `PageStructure.js` the hierarchical structure of the pages is defined.
For each page name & icon for the navigation menu, path for the vue router and the vue component are defined.

------------
### `src/styles/`
Possibility to set SCSS variables (currently not used).

------------
### `src/theme/`
Set colors of current theme.

------------
### `src/utils/`
Utility scripts that can be used in all vue components.
The most important is `dataUtils.js` where all API calls to the DataSpaceConnector are defined.