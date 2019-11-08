const express = require("express");

const userDB = require("./userDb");
const postDB = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  userDB.insert(req.body);
  res.status(200).json(req.body);
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  postDB.insert(req.body);
  res.status(200).json(req.body);
});

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

router.get("/:id/posts", validateUserId, async (req, res) => {
  const posts = await userDB.getUserPosts(req.params.id);

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(400).json({
      message: "There are no posts"
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  console.log(req.params.id);
  const user = await userDB.remove(req.params.id);

  if (user) {
    res.status(200).json({
      message: "user deleted"
    });
  }
});

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

async function validateUser(req, res, next) {
  try {
    if ("name" in req.body) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "exception",
      error
    });
  }
}

async function validatePost(req, res, next) {
  try {
    if ("text" in req.body) {
      next();
    } else {
      res.status(400).json({ message: "missing required text field" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "exception",
      error
    });
  }
}

module.exports = router;
