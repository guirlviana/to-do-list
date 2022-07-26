const express = require("express");
const checklistDependentRoute = express.Router();
const simpleRouter = express.Router();

const Checklist = require("../models/checklist");
const Task = require("../models/task");

checklistDependentRoute.get("/:id/tasks", async (req, res) => {
  try {
    let task = Task();
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (error) {
    res.status(422).render("pages/error", { errors: "Error to load form" });
  }
});

checklistDependentRoute.post("/:id/tasks/save", async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, checkList: req.params.id });
  try {
    await task.save();
    let checklist = await Checklist.findById(req.params.id);
    checklist.tasks.push(task);
    await checklist.save();
    res.redirect(`/checklists/${req.params.id}`);
  } catch (error) {
    let errors = error.errors;
    res.status(422).render("pages/error", {
      task: { ...task, errors },
      checklistId: req.params.id,
    });
  }
});

simpleRouter.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    let checklist = await Checklist.findById(task.checkList);
    let taskToRemove = checklist.tasks.indexOf(task.id);
    checklist.tasks.splice(taskToRemove, 1);
    checklist.save();
    res.redirect(`/checklists/${checklist.id}`);
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { errors: "Could not be delete task" });
  }
});

simpleRouter.put("/:id", async (req, res) => {
  let task = await Task.findById(req.params.id);
  try {
    task.set(req.body.task);
    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    let errors = error.errors;
    res.status(422).json({ task: { ...errors } });
  }
});

module.exports = {
  checklistDependent: checklistDependentRoute,
  simple: simpleRouter,
};
