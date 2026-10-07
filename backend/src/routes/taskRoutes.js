const { Router } = require("express");
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  taskUuidParamSchema,
} = require("../validators/task.schema");

const router = Router();

router.use(authenticate);

router.get("/", validate({ query: listTasksSchema }), listTasks);
router.get("/:id", validate({ params: taskUuidParamSchema }), getTask);
router.post("/", validate({ body: createTaskSchema }), createTask);
router.put(
  "/:id",
  validate({ params: taskUuidParamSchema, body: updateTaskSchema }),
  updateTask
);
router.delete("/:id", validate({ params: taskUuidParamSchema }), deleteTask);

module.exports = router;