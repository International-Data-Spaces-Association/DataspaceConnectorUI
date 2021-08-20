## Dataspace Connector UI

User interface for the [Dataspace Connector](https://github.com/International-Data-Spaces-Association/DataspaceConnector).

The following illustration visualizes the interaction of the [Dataspace Connector](https://github.com/International-Data-Spaces-Association/DataspaceConnector), the [IDS Messaging Services](https://github.com/International-Data-Spaces-Association/IDS-Messaging-Services), the Configuration Manager, and it’s GUI. All components have a defined API that allows individual components to be removed or replaced. The Dataspace Connector can be deployed standalone and can be connected to existing backend systems. Configuration Manager and GUI facilitate the operation and configuration of the connector. If desired, the Dataspace Connector may be replaced by another connector implementation, either integrating the IDS Messaging Services or not.

![Overall architecture](https://github.com/International-Data-Spaces-Association/DataspaceConnector/blob/main/docs/assets/images/dsc_architecture.png)

## Requirements
* Install and start [Dataspace Connector](https://github.com/International-Data-Spaces-Association/DataspaceConnector)
* Install [Node.js v.14](https://nodejs.org/en/download/)

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) in root directory to install DataspaceConnector UI:

```bash
npm install --no-audit
```

## Usage

### Start Dataspace Connector UI
Use the package manager [npm](https://nodejs.org/en/download/) in root directory to start Dataspace Connector UI:
```bash
npm start
```
Access: [localhost:8082](http://localhost:8082) 

### Change UI port

Change `package.json` in root directory:
```bash
"serve": "vue-cli-service serve --open --port [PORT]"
```

### Change Dataspace Connector host & port

Change in `src/backend/index.js`:
```bash
let connectorUrl = "https://localhost:8080"
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
Access: [localhost:8083](http://localhost:8083) 

### Change host/port & authentification of Dataspace Connector on docker start

Change in `docker-compose.yml`:
```bash
environment:
          - CONNECTOR_URL=https://localhost:8080
          - CONNECTOR_USER=testuser
          - CONNECTOR_PASSWORD=testpw
```

## Development

Please read the [development guide](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI/blob/develop/DEVELOPMENT_GUIDE.md).

## Contributing

Please read through our [contributing guidelines](https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI/blob/develop/CONTRIBUTING.md).

### Contact

[Bastian Wetljen | Fraunhofer FKIE](mailto:bastian.weltjen@fkie.fraunhofer.de) 
