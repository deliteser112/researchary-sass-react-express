/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');

// const { sequelize } = db;

const User = db.user;

const { ROLES } = db;

const JWT_SECRET = config.secret;
const JWT_EXPIRES_IN = 86400;

const MEMBER = 3;
exports.signup = (req, res) => {
  // Save User to Database
  const role = MEMBER;
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    photoURL: '/mock-images/avatars/avatar_1.jpg',
    password: bcrypt.hashSync(req.body.password, 8),
    roleId: role
  })
    .then((userData) => {
      const accessToken = jwt.sign({ userId: userData.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      User.update({ photoURL: `/mock-images/avatars/avatar_${userData.id}.jpg` }, { where: { id: userData.id } });

      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        photoURL: `/mock-images/avatars/avatar_${userData.id}.jpg`,
        roles: ROLES[role - 1].toUpperCase()
      };

      res.status(200).send({ accessToken, user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then((userData) => {
      if (!userData) {
        return res.status(400).send({ message: 'auth/user-not-found' });
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);

      if (!passwordIsValid) {
        return res.status(400).send({
          accessToken: null,
          message: 'auth/wrong-password'
        });
      }

      const token = jwt.sign({ userId: userData.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN // 24 hours 86400
      });

      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        photoURL: userData.photoURL,
        roles: ROLES[userData.roleId - 1].toUpperCase()
      };

      const accessToken = token;
      res.status(200).send({ accessToken, user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
