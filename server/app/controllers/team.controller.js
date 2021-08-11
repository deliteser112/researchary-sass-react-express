/* eslint-disable prefer-destructuring */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
const multer = require('multer');

const db = require('../models');

const Team = db.team;
const Topic = db.topic;

const { ROLES } = db;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/static/uploads/team-logos');
  },
  filename(req, file, cb) {
    // console.log(file);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// const upload = multer({ storage }).array('files', 100);
const upload = multer({ storage }).single('file');

// ----------------------------------------------------------------------
// Upload the file in team
// ----------------------------------------------------------------------

exports.uploadFiles = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    console.log(req.files);
    return res.status(200).send(req.file);
  });
};

// ----------------------------------------------------------------------
// Get Create Team
// ----------------------------------------------------------------------

exports.createTeam = (req, res) => {
  const { detailForm, researchTopicsForm, teamMembers } = req.body;

  const { description, name, filename, affiliation } = detailForm;

  const tags = researchTopicsForm;

  Team.create({ name, description, logoURL: `/static/uploads/team-logos/${filename}`, affiliation }).then(
    async (team) => {
      const memberIds = [];
      teamMembers.map((member) => {
        memberIds.push(member.id);
      });
      team.setUsers(memberIds);

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

      const teamTagIds = definedTags.concat(newTagIds);

      team.setTopics(teamTagIds);

      // User.findOne({ where: { id: userId } }).then((user) => {
      //   user.setTopics(newTagIds);
      // });
    }
  );

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
// Getting the team list
// ----------------------------------------------------------------------

exports.getAllTeams = (req, res) => {
  Team.findAll().then(async (teams) => {
    const AllTeams = await getTeams(teams);
    res.status(200).send(AllTeams);
  });
};

async function getTeams(teams) {
  const asyncRes = await Promise.all(
    teams.map(async (team) => {
      const { id, name, description, logoURL, affiliation } = team;

      const topics = [];
      const topicData = await team.getTopics();

      topicData.map((topic) => {
        topics.push(topic.name);
      });
      const data = team.getUsers().then((members) => {
        const teamMembers = [];
        members.map((member) => {
          const { id, firstname, lastname, email, photoURL, roleId } = member;
          teamMembers.push({
            id,
            firstname,
            lastname,
            email,
            photoURL,
            roles: ROLES[roleId - 1].toUpperCase()
          });
        });
        const teamData = {
          id,
          name,
          description,
          logoURL,
          affiliation,
          members: teamMembers,
          topics
        };

        return teamData;
      });
      return data;
    })
  );
  return asyncRes;
}

// ----------------------------------------------------------------------
// Update Team
// ----------------------------------------------------------------------

exports.updateTeam = (req, res) => {
  console.log(req.body);
  const { id, detailForm, researchTopicsForm, teamMembers } = req.body;

  const { description, name, filename, affiliation } = detailForm;

  const tags = researchTopicsForm;

  Team.update({ name, description, logoURL: `/static/uploads/team-logos/${filename}`, affiliation }, { where: { id } });

  Team.findOne({ where: { id } }).then(async (team) => {
    const memberIds = [];
    teamMembers.map((author) => {
      memberIds.push(author.id);
    });
    team.setUsers(memberIds);

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

    team.setTopics(paperTagIds);
  });

  res.status(200).send({ message: 'success' });
};
