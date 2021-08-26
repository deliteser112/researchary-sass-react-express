const Sequelize = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.topic = require('./topic.model')(sequelize, Sequelize);
db.paper = require('./paper.model')(sequelize, Sequelize);
db.task = require('./task.model')(sequelize, Sequelize);
db.file = require('./file.model')(sequelize, Sequelize);
db.team = require('./team.model')(sequelize, Sequelize);
db.conference = require('./conference.model')(sequelize, Sequelize);
db.version = require('./version.model')(sequelize, Sequelize);
db.timeline = require('./timeline.model')(sequelize, Sequelize);
db.comment = require('./comment.model')(sequelize, Sequelize);

// paper vs topic relative
db.topic.belongsToMany(db.paper, {
  through: 'paper_topics',
  foreignKey: 'topicId',
  otherKey: 'paperId'
});
db.paper.belongsToMany(db.topic, {
  through: 'paper_topics',
  foreignKey: 'paperId',
  otherKey: 'topicId'
});

// user vs topic relative
db.topic.belongsToMany(db.user, {
  through: 'user_topics',
  foreignKey: 'topicId',
  otherKey: 'userId'
});
db.user.belongsToMany(db.topic, {
  through: 'user_topics',
  foreignKey: 'userId',
  otherKey: 'topicId'
});

// paper vs user relative
db.paper.belongsToMany(db.user, {
  through: 'paper_authors',
  foreignKey: 'paperId',
  otherKey: 'userId'
});
db.user.belongsToMany(db.paper, {
  through: 'paper_authors',
  foreignKey: 'userId',
  otherKey: 'paperId'
});

// team vs user relative
db.team.belongsToMany(db.user, {
  through: 'team_members',
  foreignKey: 'teamId',
  otherKey: 'userId'
});
db.user.belongsToMany(db.team, {
  through: 'team_members',
  foreignKey: 'userId',
  otherKey: 'teamId'
});

// team vs topic relative
db.topic.belongsToMany(db.team, {
  through: 'team_topics',
  foreignKey: 'topicId',
  otherKey: 'teamId'
});
db.team.belongsToMany(db.topic, {
  through: 'team_topics',
  foreignKey: 'teamId',
  otherKey: 'topicId'
});

// conference vs topic relative
db.topic.belongsToMany(db.conference, {
  through: 'conference_topics',
  foreignKey: 'topicId',
  otherKey: 'conferenceId'
});
db.conference.belongsToMany(db.topic, {
  through: 'conference_topics',
  foreignKey: 'conferenceId',
  otherKey: 'topicId'
});

// conference vs team relative
db.team.belongsToMany(db.conference, {
  through: 'conference_teams',
  foreignKey: 'teamId',
  otherKey: 'conferenceId'
});
db.conference.belongsToMany(db.team, {
  through: 'conference_teams',
  foreignKey: 'conferenceId',
  otherKey: 'teamId'
});

// paper vs task relative
db.paper.hasMany(db.task, {
  foreignKey: 'paperId'
});
db.task.belongsTo(db.paper);

// paper vs file relative
db.paper.hasMany(db.file, {
  foreignKey: 'paperId'
});
db.file.belongsTo(db.paper);

// paper vs timeline relative
db.paper.hasMany(db.timeline, {
  foreignKey: 'paperId'
});
db.timeline.belongsTo(db.paper);

// conference vs version relative
db.conference.hasMany(db.version, {
  foreignKey: 'conferenceId'
});
db.version.belongsTo(db.conference);

db.ROLES = ['admin', 'team admin', 'user'];

db.TOPICS = [
  'Wellbeing',
  'Sustainable Communities',
  'Information Society',
  'Cybersecurity',
  'Blockchain',
  'Digital identity',
  'Digital forensics',
  'Networks',
  'IoT devices',
  'Software-defined networking',
  'Data science',
  'Machine learning',
  'Software engineering',
  'Ubiquitous computing',
  'Mobile computing',
  'Secure coding'
];

db.STATUS = [
  'Not started',
  'In progress',
  'Blocked/On Hold',
  'Ready to submit',
  'Submitted/Under review',
  'Rejected',
  'Accepted',
  'Published'
];
db.TASKSTATUS = ['Not started', 'In progress', 'Completed'];

module.exports = db;
