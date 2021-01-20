## IDS Configurationmanager UI

User interface for the [IDS Configurationmanager](https://github.com/FraunhoferISST/IDS-Configurationmanager).

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) in root directory to install Configurationmanager UI:

```bash
npm install
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

## Contributing

Please read through our [contributing guidelines](https://github.com/fkie/ids-configmanager-ui/blob/master/CONTRIBUTING.md).

## Contact

[Bastian Wetljen | Fraunhofer FKIE](mailto:bastian.weltjen@fkie.fraunhofer.de) 
