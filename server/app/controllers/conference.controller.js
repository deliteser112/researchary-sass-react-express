/* eslint-disable array-callback-return */
const multer = require('multer');

const db = require('../models');

const Team = db.team;
const Conference = db.conference;
const Topic = db.topic;
const Version = db.version;

const { ROLES } = db;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/static/uploads/conference-logos');
  },
  filename(req, file, cb) {
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
// Get Create Conference
// ----------------------------------------------------------------------

exports.createConference = (req, res) => {
  const { detailForm, researchTopicsForm, conferenceVersionForm } = req.body;

  const { description, name, filename, publisher, abbreviation, score } = detailForm;
  const { topics, teams } = researchTopicsForm;

  const tags = topics;

  const versions = conferenceVersionForm;

  Conference.create({
    name,
    description,
    logoURL: `/static/uploads/conference-logos/${filename}`,
    publisher,
    abbreviation,
    score
  }).then(async (conference) => {
    const teamIds = [];
    teams.map((team) => {
      teamIds.push(team.id);
    });
    conference.setTeams(teamIds);

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

    conference.setTopics(teamTagIds);

    versions.map(async (version) => {
      const { year, country, city, startDate, endDate, submissionDate, submissionLink, conferenceSite, isOnline } =
        version;
      await Version.create({
        year,
        location: JSON.stringify(country),
        city,
        startDate,
        endDate,
        submissionDate,
        submissionLink,
        conferenceSite,
        isOnline,
        conferenceId: conference.id
      });
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
// Getting the conference list
// ----------------------------------------------------------------------

exports.getAllConferences = (req, res) => {
  Conference.findAll().then(async (conferences) => {
    const AllConferences = await getConferences(conferences);
    res.status(200).send(AllConferences);
  });
};

async function getConferences(conferences) {
  const asyncRes = await Promise.all(
    conferences.map(async (conference) => {
      const {
        id,
        name,
        description,
        abbreviation,
        logoURL,
        publisher,
        score,
        toSubmit,
        underReview,
        published,
        updatedAt
      } = conference;

      const topics = [];
      const teams = [];
      const topicData = await conference.getTopics();
      const teamData = await conference.getTeams();

      topicData.map((topic) => {
        topics.push(topic.name);
      });

      teamData.map((team) => {
        const { id, name, logoURL, description, affiliation } = team;
        teams.push({
          id,
          name,
          logoURL,
          description,
          affiliation
        });
      });

      const versions = await Version.findAll({ where: { conferenceId: id } }).then((versions) => {
        const versionData = [];
        versions.map((version) => {
          const {
            id,
            year,
            location,
            city,
            startDate,
            endDate,
            submissionDate,
            conferenceSite,
            submissionLink,
            isOnline
          } = version;
          versionData.push({
            id,
            year,
            country: JSON.parse(location),
            city,
            startDate,
            endDate,
            submissionDate,
            conferenceSite,
            submissionLink,
            isOnline
          });
        });
        return versionData;
      });

      const data = {
        id,
        name,
        description,
        abbreviation,
        logoURL,
        publisher,
        score,
        topics,
        teams,
        versions,
        dueDate: updatedAt.toISOString().split('T')[0],
        toSubmit,
        underReview,
        published
      };
      return data;
    })
  );
  return asyncRes;
}

// ----------------------------------------------------------------------
// Update Conference
// ----------------------------------------------------------------------

exports.updateConference = (req, res) => {
  const { id, detailForm, researchTopicsForm, conferenceVersionForm } = req.body;

  const { description, name, filename, publisher, abbreviation, score } = detailForm;
  const { topics, teams } = researchTopicsForm;

  const tags = topics;

  const versions = conferenceVersionForm;

  Conference.update(
    { name, description, logoURL: `/static/uploads/conference-logos/${filename}`, publisher, abbreviation, score },
    { where: { id } }
  );

  Conference.findOne({ where: { id } }).then(async (conference) => {
    const teamIds = [];
    teams.map((team) => {
      teamIds.push(team.id);
    });
    conference.setTeams(teamIds);

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

    conference.setTopics(teamTagIds);

    await Version.destroy({ where: { conferenceId: id } });

    versions.map(async (version) => {
      const { year, country, city, startDate, endDate, submissionDate, submissionLink, conferenceSite, isOnline } =
        version;
      await Version.create({
        year,
        location: JSON.stringify(country),
        city,
        startDate,
        endDate,
        submissionDate,
        submissionLink,
        conferenceSite,
        isOnline,
        conferenceId: conference.id
      });
    });
  });

  res.status(200).send({ message: 'success' });
};
