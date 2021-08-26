/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const jwt = require('jsonwebtoken');
const multer = require('multer');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const db = require('../models');

const User = db.user;
const { ROLES } = db;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/static/uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage }).single('file');

exports.getUserList = (req, res) => {
  User.findAll().then((userInfos) => {
    const users = [];
    userInfos.map((userInfo) => {
      const { id, firstname, lastname, email, photoURL, roleId } = userInfo;
      const user = {
        id,
        firstname,
        lastname,
        email,
        photoURL,
        roles: ROLES[roleId - 1].toUpperCase()
      };

      users.push(user);
    });
    res.status(200).send({ users });
  });
};

exports.updateProfile = (req, res) => {
  User.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      photoURL: req.body.photoURL,
      roles: 1
    },
    { where: { email: req.body.email } }
  )
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.log('error', error);
    });
};

exports.uploadAvatar = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
};

exports.getProfile = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  User.findOne({
    where: {
      id: userId
    }
  }).then((userData) => {
    const user = {
      id: userData.id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      photoURL: userData.photoURL,
      roles: ROLES[userData.roleId - 1].toUpperCase()
    };

    res.status(200).send({ user });
  });
};
