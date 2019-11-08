const express = require("express");

const userDB = require("./userDb");
const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const users = await userDB.get(req.query);

    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "The users information could not be retrieved."
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const id = await userDB.getById(req.params.id);
    console.log(req.params);

    if (id) {
      req.user = id;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "exception",
      error
    });
  }
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
