const Router = require("express");
const router = new Router();
const answerController = require("../controllers/answerController");

router.post("/", answerController.create);
router.get("/", answerController.getAll);

module.exports = router;
