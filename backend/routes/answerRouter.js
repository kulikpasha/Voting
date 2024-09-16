const Router = require("express");
const router = new Router();
const answerController = require("../controllers/answerController");

router.post("/", answerController.create);
router.get("/:question_id", answerController.getAll);

module.exports = router;
