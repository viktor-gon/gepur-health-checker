require('dotenv').config();
const fs = require('fs');

import { fileDbPath } from '../paths.js';

export const saveDataJSON = (data) => {
  console.log('Sync to...', fileDbPath);

  fs.writeFile(fileDbPath, JSON.stringify(data), (err) => {
    if (!err) {
      console.log('Successfully updated base', data);
    } else {
      console.log('err', err);
    }
  });
};

export const getDataJSON = () => {
  if (!fs.existsSync(fileDbPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(fileDbPath));
};
