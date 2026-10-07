const { readFileSync } = require("node:fs");
const path = require("node:path");
const { Router } = require("express");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");

const specPath = path.resolve(__dirname, "../../../docs/openapi.yaml");
const source = readFileSync(specPath, "utf8");
const specification = YAML.parse(source);
const router = Router();

/**
 * Sends the public API specification without account data or credentials.
 *
 * @type {import('express').RequestHandler}
 */
function getSpecification(_req, res) {
  res.type("application/yaml").send(source);
}

router.get("/openapi.yaml", getSpecification);
router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(specification, {
    customSiteTitle: "TaskFlow API",
    swaggerOptions: { persistAuthorization: false, validatorUrl: null },
  })
);

module.exports = router;
