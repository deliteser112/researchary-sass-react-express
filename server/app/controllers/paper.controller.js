/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const db = require('../models');

const Paper = db.paper;
const Topic = db.topic;
const User = db.user;
const Conference = db.conference;
const Timeline = db.timeline;

const { ROLES, STATUS } = db;

// ----------------------------------------------------------------------
// Get Create Paper
// ----------------------------------------------------------------------

exports.createPaper = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  const { detailForm, targetForm, coAuthors } = req.body;

  const { description, title, tags, privacy, openRequest } = detailForm;

  Paper.create({ title, description, privacy, openRequest, target: targetForm, status: 0 }).then(async (paper) => {
    const authorIds = [];
    coAuthors.map((author) => {
      authorIds.push(author.id);
    });
    paper.setUsers(authorIds);

    const customTags = await Topic.findAll().then((topics) => {
      const definedTags = [];
      const undefinedTags = [];
      for (let i = 0; i < tags.length; i += 1) {
        let isExist = false;
        let topicId = 0;
        for (let j = 0; j < topics.length; j += 1) {
          if (topics[j].isActive === 1 && topics[j].name === tags[i]) {
            isExist = true;
            topicId = topics[j].id;
            break;
          }
        }
        if (isExist) {
          definedTags.push(topicId);
        } else {
          undefinedTags.push(tags[i]);
        }
      }

      return { definedTags, undefinedTags };
    });

    const { definedTags, undefinedTags } = customTags;
    let newTagIds = [];
    if (undefinedTags.length > 0) {
      newTagIds = await getNewTagIds(undefinedTags);
    }

    const paperTagIds = definedTags.concat(newTagIds);

    paper.setTopics(paperTagIds);

    User.findOne({ where: { id: userId } }).then((user) => {
      user.setTopics(newTagIds);
    });
  });

  res.status(200).send({ message: 'success' });
};

async function getNewTagIds(undefinedTags) {
  const asyncRes = await Promise.all(
    undefinedTags.map((newTag) => {
      const newTagId = Topic.create({ name: newTag, isActive: 1 }).then((topic) => topic.id);
      return newTagId;
    })
  );
  return asyncRes;
}

// ----------------------------------------------------------------------
// Get All Timelines
// ----------------------------------------------------------------------

exports.getTimelines = (req, res) => {
  Timeline.findAll().then((timelines) => {
    const timelineList = [];
    timelines.map((timeline) => {
      const { id, name, photoURL, eventText, eventContent, date, isStatus, status, paperId, createdAt } = timeline;
      const today = new Date();
      const updated = today - new Date(createdAt);
      const oneDay = 1000 * 60 * 60 * 24;
      let updatedDay = Math.floor(updated / oneDay);
      if (updatedDay > 0) {
        updatedDay = `${updatedDay} days ago`;
      } else {
        updatedDay = 'Today';
      }
      timelineList.push({
        id,
        paperId,
        name,
        photoURL,
        eventText,
        eventContent,
        date,
        isStatus,
        status,
        updatedDay
      });
    });
    res.status(200).send(timelineList);
  });
};

// ----------------------------------------------------------------------
// Get All Topics
// ----------------------------------------------------------------------

exports.getTopics = (req, res) => {
  Topic.findAll().then((topicDatas) => {
    const topics = [];
    topicDatas.map((topic) => {
      const { name, isActive } = topic;
      if (isActive) {
        topics.push(name);
      }
    });
    res.status(200).send({ topics });
  });
};

// ----------------------------------------------------------------------
// Get All Papers
// ----------------------------------------------------------------------

exports.getAllPapers = (req, res) => {
  Paper.findAll().then(async (papers) => {
    const AllPapers = await getPapers(papers);
    res.status(200).send(AllPapers);
  });
};

// ----------------------------------------------------------------------
// Get Published Papers
// ----------------------------------------------------------------------

exports.getPublishedPapers = (req, res) => {
  Paper.findAll({ where: { status: 6 } }).then(async (papers) => {
    const PublishedPapers = await getPapers(papers);
    res.status(200).send(PublishedPapers);
  });
};

async function getPapers(papers) {
  const asyncRes = await Promise.all(
    papers.map(async (paper) => {
      const { id, title, description, privacy, openRequest, status, target, createdAt } = paper;

      const topics = [];
      const topicData = await paper.getTopics();

      topicData.map((topic) => {
        topics.push(topic.name);
      });

      const conf = await Conference.findOne({ where: { id: target } });
      let confName = '';
      let confLogo = '';
      if (conf !== null) {
        const { name, logoURL } = conf;
        confName = name;
        confLogo = logoURL;
      }
      const data = paper.getUsers().then((authors) => {
        const coAuthors = [];
        authors.map((author) => {
          const { id, firstname, lastname, email, photoURL, roleId } = author;
          coAuthors.push({
            id,
            firstname,
            lastname,
            email,
            photoURL,
            roles: ROLES[roleId - 1].toUpperCase()
          });
        });
        const paperData = {
          id,
          title,
          description,
          privacy,
          openRequest,
          status: STATUS[status],
          authors: coAuthors,
          target: { id: target, name: confName, logoURL: confLogo },
          topics,
          dueDate: createdAt.toISOString().slice(0, 10)
        };

        return paperData;
      });
      return data;
    })
  );
  return asyncRes;
}

// ----------------------------------------------------------------------
// Update Paper
// ----------------------------------------------------------------------

exports.updatePaper = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  const { id, detailForm, targetForm, coAuthors } = req.body;

  const { description, title, tags, privacy, openRequest } = detailForm;
  Paper.update({ title, description, privacy, openRequest, target: targetForm }, { where: { id } });

  Paper.findOne({ where: { id } }).then(async (paper) => {
    const authorIds = [];
    coAuthors.map((author) => {
      authorIds.push(author.id);
    });
    paper.setUsers(authorIds);

    const customTags = await Topic.findAll().then((topics) => {
      const definedTags = [];
      const undefinedTags = [];
      for (let i = 0; i < tags.length; i += 1) {
        let isExist = false;
        let topicId = 0;
        for (let j = 0; j < topics.length; j += 1) {
          if (topics[j].isActive === 1 && topics[j].name === tags[i]) {
            isExist = true;
            topicId = topics[j].id;
            break;
          }
        }
        if (isExist) {
          definedTags.push(topicId);
        } else {
          undefinedTags.push(tags[i]);
        }
      }

      return { definedTags, undefinedTags };
    });

    const { definedTags, undefinedTags } = customTags;
    let newTagIds = [];
    if (undefinedTags.length > 0) {
      newTagIds = await getNewTagIds(undefinedTags);
    }

    const paperTagIds = definedTags.concat(newTagIds);

    paper.setTopics(paperTagIds);

    User.findOne({ where: { id: userId } }).then((user) => {
      user.setTopics(newTagIds);
    });
  });

  res.status(200).send({ message: 'success' });
};

// ----------------------------------------------------------------------
// Update Status in Paper
// ----------------------------------------------------------------------

exports.updateStatus = async (req, res) => {
  const { pId, statusId } = req.body;

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  const userInfo = await User.findOne({ where: { id: userId } });
  const { firstname, lastname, photoURL } = userInfo;

  const name = `${firstname} ${lastname}`;
  const date = new Date().toDateString();
  const eventText = `On ${date}, ${name} marked paper status as`;
  const isStatus = true;
  const status = STATUS[statusId];
  await Timeline.create({ name, date, eventText, isStatus, status, photoURL, userId, paperId: pId });
  Paper.update({ status: statusId }, { where: { id: pId } }).then(() => {
    res.status(200).send({ message: 'success' });
  });
};
