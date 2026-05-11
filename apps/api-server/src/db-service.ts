let dbService: any;

try {
  dbService = require('db-schema').dbService;
} catch {
  dbService = require('./stubs/db-schema').dbService;
}

export { dbService };
