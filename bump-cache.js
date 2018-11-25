const fs = require('fs');
const path = require('path');

const config = {
  files: ['public/index.html'],
};

/**
 * Convert node arguments into an object
 * @return {Object} Arguments
 */
const argvToObject = () => {
  const args = {};
  let arg = null;
  process.argv.forEach((val, index) => {
    if (/^--/.test(val)) {
      arg = {
        index,
        name: val.replace(/^--/, ''),
      };
      return;
    }

    if (arg && arg.index + 1 === index) {
      args[arg.name] = val;
    }
  });

  return args;
};

/**
 * Loop through files updating the current version
 * @param  {Object} config
 */
const updateVersion = ({ files }) => {
  const args = argvToObject();
  const version = args.current;

  console.log(`Updating version to ${version}`);

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const regex = new RegExp(/\?version=(.*?)\"/, 'g');

    let contents = fs.readFileSync(filePath, 'utf-8');
    contents = contents.replace(regex, `?version=${version}"`);
    fs.writeFileSync(filePath, contents);
  });

  console.log(`Updated version to ${version}`);
};

updateVersion(config);
