const Router = require("express");
const router = new Router();
const answerController = require("../controllers/answerController");

router.post("/", answerController.create);
router.get("/", answerController.getAll);
router.get('/last/?:question_id&?:poll_id', answerController.getLast)
router.post('/:poll_id', answerController.editAnswers)
router.delete('/:id', answerController.deleteAnswer)
router.get('/allFuckingAnswers/please', answerController.testAns)

module.exports = router;
