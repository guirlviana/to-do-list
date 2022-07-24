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

router.get("/new", async (req, res) => {
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (error) {
    res.status(500).status("pages/error", { errors: "Error to load form" });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new Checklist({ name });
  try {
    await checklist.save();
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(422)
      .render("checklists/new", { checklists: { ...checklist, error } });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ _id: req.params.id });
    console.log(checklist);
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (error) {
    res.status(500).render("pages/error", { error: "Task lists not found" });
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
