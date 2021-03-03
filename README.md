## IDS Configurationmanager UI

User interface for the [IDS Configurationmanager](https://github.com/FraunhoferISST/IDS-Configurationmanager).

The following illustration visualizes the interaction of [Dataspace Connector](https://github.com/FraunhoferISST/DataspaceConnector), [IDS Framework](https://github.com/FraunhoferISST/IDS-Connector-Framework), [Configuration Manager](https://github.com/FraunhoferISST/IDS-Configurationmanager), and GUI. All components have a defined API that allows individual components to be removed or replaced. The connector can be deployed standalone and can be connected to existing backend systems. Configuration Manager and GUI facilitate the operation and configuration of the connector. If desired, the Dataspace Connector may be replaced by another connector implementation, either integrating the framework or not.

![Overall architecture](https://github.com/fkie/ids-configmanager-ui/blob/master/images/overall-architecture.png?raw=true)

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) in root directory to install Configurationmanager UI:

```bash
npm install --no-audit
```

## Usage

### Requirements
* Install and start [IDS DataSpaceConnector](https://github.com/FraunhoferISST/DataspaceConnector)
* Install and start [IDS Configurationmanager](https://github.com/FraunhoferISST/IDS-Configurationmanager)

### Start IDS Configurationmanager UI
Use the package manager [npm](https://nodejs.org/en/download/) in root directory to start Configurationmanager UI:
```bash
npm start
```
Access: [localhost:8082](http://localhost:8082) 

### Change port

Change `package.json` in root directory:
```bash
"serve": "vue-cli-service serve --open --port [PORT]"
```

### Change theme

You can change the main colors of the user interface in `src/theme/default.js`

## Start with Docker

Build docker image:
```bash
./buildDockerImage.sh
```
Run docker image:
```bash
sudo docker-compose up
```

## Contributing

Please read through our [contributing guidelines](https://github.com/fkie/ids-configmanager-ui/blob/master/CONTRIBUTING.md).

## Versioning

[IDS Configurationmanager](https://github.com/FraunhoferISST/IDS-Configurationmanager) and the UI versioning skipped major version 1, 2 and 3 to match versioning of [IDS DataSpaceConnector](https://github.com/FraunhoferISST/DataspaceConnector).
This way the major version of DSC, CM and UI indicates compatibility.

### Contact

[Bastian Wetljen | Fraunhofer FKIE](mailto:bastian.weltjen@fkie.fraunhofer.de) 
