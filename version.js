// Example usage: npm --newVersion=3.0.4 run version

const fs = require('fs');
const path = require('path');
const config = {
  files: ['bower.json', 'package.json', 'index.html', 'version.js']
};

/**
 * Convert node arguments into an object
 * @return {Object} Arguments
 */
const argvToObject = () => {
  const args = {};
  let arg = null;
  process.argv.forEach((val, index) => {
    if(/^--/.test(val)) {
      arg = {
        index: index,
        name: val.replace(/^--/, '')
      }
      return;
    }

    if(arg && ((arg.index+1 === index ))) {
      args[arg.name] = val;
    }
  });

  return args;
};

/**
 * Loop through files updating the current version
 * @param  {Object} config
 */
const updateVersion = (config) => {
  const args = argvToObject();
  const currentVersion = args.current;
  const newVersion = args.new;

  console.log(`Updating version from ${currentVersion} to ${newVersion}`);

  config.files.forEach((file) => {
    const filePath = path.join(__dirname, file);
    const regex = new RegExp(currentVersion, 'g');

    let contents = fs.readFileSync(filePath, 'utf-8');
    contents = contents.replace(regex, newVersion);
    fs.writeFileSync(filePath, contents);
  });

  console.log(`Updated version to ${newVersion}`);
};

updateVersion(config);
