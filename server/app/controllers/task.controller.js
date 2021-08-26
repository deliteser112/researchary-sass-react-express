/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const db = require('../models');

const User = db.user;
const Task = db.task;
const Timeline = db.timeline;

const { TASKSTATUS } = db;

// ----------------------------------------------------------------------
// Create the task
// ----------------------------------------------------------------------

exports.createTask = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);
  const { paperId, title, assignTo, status, dueDate, details } = req.body;
  Task.create({ paperId, title, createdBy: userId, assignedTo: assignTo, status, dueDate, details });

  const userInfo = await User.findOne({ where: { id: userId } });
  const { firstname, lastname, photoURL } = userInfo;

  const name = `${firstname} ${lastname}`;
  const date = new Date().toDateString();
  const eventText = `On ${date}, ${name} added the task like`;
  const eventContent = `Task title: "${title}", Status: "${TASKSTATUS[status]}"`;
  const isStatus = false;
  await Timeline.create({ name, date, eventText, eventContent, isStatus, photoURL, userId, paperId });
  res.status(200).send({ message: 'success' });
};

// ----------------------------------------------------------------------
// Get paper Task
// ----------------------------------------------------------------------

exports.getPaperTasks = (req, res) => {
  Task.findAll().then(async (tasks) => {
    const taskList = await getTasks(tasks);
    res.status(200).send(taskList);
  });
};

async function getTasks(tasks) {
  const asyncRes = await Promise.all(
    tasks.map(async (task) => {
      const { id, title, createdBy, assignedTo, status, dueDate, details, paperId } = task;
      const assignedUserInfo = await User.findOne({ where: { id: assignedTo } });
      const createdByUserInfo = await User.findOne({ where: { id: createdBy } });
      const createdby = {
        id: createdByUserInfo.id,
        firstname: createdByUserInfo.firstname,
        lastname: createdByUserInfo.lastname,
        photoURL: createdByUserInfo.photoURL
      };

      const assignedby = {
        id: assignedUserInfo.id,
        firstname: assignedUserInfo.firstname,
        lastname: assignedUserInfo.lastname,
        photoURL: assignedUserInfo.photoURL
      };

      const res = {
        id,
        title,
        createdby,
        assignedby,
        status: TASKSTATUS[status],
        dueDate,
        details,
        paperId
      };
      return res;
    })
  );
  return asyncRes;
}

// ----------------------------------------------------------------------
// Update the task
// ----------------------------------------------------------------------

exports.updateTask = (req, res) => {
  const { taskId, paperId, title, assignTo, status, dueDate, details } = req.body;
  Task.update({ title, assignedTo: assignTo, status, dueDate, details }, { where: { paperId, id: taskId } });
  res.status(200).send({ message: 'success' });
};
