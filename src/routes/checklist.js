const express = require("express");
const Checklist = require("../models/checklist");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let checklist = await Checklist.find({});
    res.status(200).render("checklists/index", { checklists: checklist });
  } catch (error) {
    res.status(422).render("pages/error", { error: "Lists not found" });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body;
  try {
    let checklist = await Checklist.create({ name });
    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ _id: req.params.id });
    console.log(checklist);
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (error) {
    res.status(422).render("pages/error", { error: "Task lists not found" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let { name } = req.body;
    let checklist = await Checklist.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
  } catch (error) {}
});

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findByIdAndRemove(req.params.id);
    res.status(200).json(checklist);
  } catch (error) {
    +res.status(422).json(error);
  }
});

module.exports = router;
