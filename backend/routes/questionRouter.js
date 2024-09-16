const Router = require("express");
const router = new Router();
const questionController = require("../controllers/questionController");

router.post("/", questionController.create);
router.get("/", questionController.getAll);
router.get("/:id", questionController.getOne);
router.get("/all/:poll_id", questionController.getPollQuestions);
router.post("/:id", questionController.editQuestion)

module.exports = router;
