const Router = require("express");
const router = new Router();
const PollController = require("../controllers/pollController");

router.post("/", PollController.create);
router.get("/", PollController.getAll);
router.get("/:id", PollController.getOne);
router.delete("/:id", PollController.delete);

module.exports = router;
