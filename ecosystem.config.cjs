const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const env = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};

module.exports = {
  apps: [
    {
      name: 'frankuxui.dev',
      script: 'npm',
      args: 'run preview',
      cwd: __dirname,
      env,
    },
  ],
};
