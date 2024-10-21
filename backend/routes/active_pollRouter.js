const Router = require("express");
const router = new Router();
const Active_pollController = require("../controllers/active_pollController");
const active_pollController = require("../controllers/active_pollController");

router.post("/", Active_pollController.create);
router.get('/', Active_pollController.getAll)
router.delete("/:id", Active_pollController.delete);
router.get("/one", Active_pollController.getOne);
router.post("/next", Active_pollController.nextQuestion);
router.post("/prev", Active_pollController.prevQuestion);
router.get("/longpoll/:poll_id", Active_pollController.longPoll);
router.post('/update', active_pollController.changePollStatus)

module.exports = router;
