const { Router } = require("express");
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  uuidParamSchema,
} = require("../validators/project.schema");

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.get("/", validate({ query: listProjectsSchema }), listProjects);
router.get("/:id", validate({ params: uuidParamSchema }), getProject);
router.post("/", validate({ body: createProjectSchema }), createProject);
router.put(
  "/:id",
  validate({ params: uuidParamSchema, body: updateProjectSchema }),
  updateProject
);
router.delete("/:id", validate({ params: uuidParamSchema }), deleteProject);

module.exports = router;