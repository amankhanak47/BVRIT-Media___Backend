const express = require("express");
const UsersCollection = require("../Models/Users");
const UsersimgsCollection = require("../Models/Userimg");
var db = require("database");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchusers = require("../middleware/fetchusers");
// const { db } = require("../Models/Users");

const JWT_SECRET = "qwertyuiop";

// users Signup
// Route 1
router.post(
  "/userssignup",
  [
    body("name", "Enter a valid name").isLength({ min: 1 }),
    body("password").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let users = await UsersCollection.findOne({ email: req.body.email });
      if (users) {
        return res.status(400).json({
          sucess: sucess,
          error: "sorry a user with this email already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);

      //create ney user
      users = await UsersCollection.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: users.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//uthenticate a user "./api/auth/login"
//ROUte 2
router.post(
  "/userslogin",
  [
    // body('name', 'Enter a valid name').isLength({min:5}),
    body("password", "password cannot be blank").exists(),

    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let users = await UsersCollection.findOne({ email });
      if (!users) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const passcompare = await bcrypt.compare(password, users.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const data = {
        user: {
          id: users.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

router.post("/getmember", fetchusers, async (req, res) => {
  try {
    memberId = req.student.id;
    console.log(req.student.id);
    console.log("first");

    const faculty = await UsersCollection.findById(memberId).select(
      "-password"
    );
    res.send(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});

router.post("/getallmember", async (req, res) => {
  try {
    // memberId = req.student.id;
    // console.log(req.student.id)
    // console.log("first")

    const faculty = await UsersCollection.find();
    res.send(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});

//adding images user
router.post("/addimg", [body("img")], fetchusers, async (req, res) => {
  try {
    const { img} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = await new UsersimgsCollection({
      img,
      user: req.student.id,
    });

    const savenote = await note.save();

    res.json(savenote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some  error occured");
  }
});

router.post("/getallimgs", async (req, res) => {
  try {
    // memberId = req.student.id;
    // console.log(req.student.id)
    // console.log("first")

    const faculty = await UsersimgsCollection.find();
    res.send(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});

//get user with id
router.post("/getmemberwithid",[body("id")] , async (req, res) => {
  try {
    memberId = req.body.id;
    console.log(memberId);
    console.log("first");

    const faculty = await UsersCollection.findById(memberId).select(
      "-password"
    );
    res.send(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});

router.post("/fetchallimgs",[body("id")] , async (req, res) => {
  try {
    const notes = await UsersimgsCollection.find({ user: req.body.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});


module.exports = router;
