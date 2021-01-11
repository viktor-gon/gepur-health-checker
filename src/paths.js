const fs = require('fs');
const path = require('path');

export const fileDb = process.env.DATA_FILE || 'data/chat-id-json.raw';
export const fileDbPath = path.resolve(__dirname, fileDb);
