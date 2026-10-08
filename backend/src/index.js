// Compatibility entry for tooling that imports src/index.js.
// The PostgreSQL application lives in app.js; npm start uses server.js.
module.exports = require("./app");
