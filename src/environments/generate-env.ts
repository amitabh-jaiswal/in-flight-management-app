const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  const { argv } = require('yargs');
// Configure Angular `environment.ts` file path
  const isProd = argv.prod ? true : argv.environment === 'prod' ? true : false;
  const targetPath = `./src/environments/environment.${isProd ? 'prod.' : ''}ts`;
// Load node modules
  const colors = require('colors');
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env'
  });
  console.log(colors.magenta('The args passed in the generate command: \n', JSON.stringify(argv)));
  console.log(colors.magenta('\nEnvironment Variables: \n', JSON.stringify(process.env)));
// `environment.ts` file structure
  const envConfigFile = `export const environment = {
    production: ${isProd},
    baseUrl: '${isProd ? process.env.BASE_URL : process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:3000/'}',
    firebaseConfig: {
      apiKey: '${process.env.FIREBASE_API_KEY}'
    }
  };
`;
  console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
  writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
  });
};

setEnv();
