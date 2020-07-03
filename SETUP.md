# InFlightManagementApp | GoCraftManagementApp

## Required Packages

`Node.js`
`Angular CLI v9.1.7`
`json-server`
`http-server`

## INSTALL PACKAGES

### For Angular CLI

Run `npm install -g @angular/cli@9.1.7` to install angular cli.

### For JSON-SERVER

Run `npm install -g json-server`

### For HTTP-SERVER

Run `npm install -g http-server`

## Build InFlightManagementApp

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory.

## Run json-server

Navigate to the directory where `db.json` file is stored. Then, run `json-server db.json -p 3000`.

\*\*Note:- Run JSON Server Only on PORT 3000.

## Run App

After building the app navigate to `dist/in-fligh-management-app` directory. Then, Run `http-server -p 4300` to run the build app

\*\*Note: You can also use `ng serve` command to run but in this case service workers will be disabled.

## Run Unit Tests

Run `ng test` to execute the unit test via [Karma]

## For Code Coverage

Run `ng test --code-coverage` to execute unit test via [karma] and generate code coverage. The code coverage details will be generated in the `coverage` folder of the root directory.

## Run end-to-end tests

Run `ng e2e --port 4600` to execute end-to-end testing.
