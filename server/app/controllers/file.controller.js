/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
const multer = require('multer');
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const db = require('../models');

const File = db.file;
const User = db.user;
const Timeline = db.timeline;

const fileTypes = [
  { 'application/pdf': 'pdf' },
  { 'application/msword': 'word' },
  { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word' },
  { 'application/vnd.ms-powerpoint': 'ppt' },
  { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt' },
  { 'application/vnd.ms-excel': 'excel' },
  { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel' }
];

const storage = multer.diskStorage({
  destination(req, files, cb) {
    cb(null, '../public/static/uploads/task-files');
  },
  async filename(req, files, cb) {
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
    const { userId } = jwt.verify(accessToken, JWT_SECRET);

    const { paperId, filesize } = req.body;
    let paId = 0;
    let faId = 0;
    if (paperId !== undefined && filesize !== undefined) {
      paId = paperId[0];
      faId = filesize[filesize.length - 1];
    }
    const filename = `${Date.now()}-${files.originalname}`;

    let filetype = '';
    if (files.mimetype.includes('image')) {
      filetype = 'image';
    } else {
      const tmpType = files.mimetype;
      fileTypes.map((fileType) => {
        if (fileType[tmpType] !== undefined) {
          filetype = fileType[tmpType];
        }
      });
    }

    // adding to timeline
    const userInfo = await User.findOne({ where: { id: userId } });
    const { firstname, lastname, photoURL } = userInfo;

    const name = `${firstname} ${lastname}`;
    const date = new Date().toDateString();
    const eventText = `On ${date}, ${name} added the file like`;
    const eventContent = `File name: "${files.originalname}", File Type: "${filetype}"`;
    const isStatus = false;
    await Timeline.create({ name, date, eventText, eventContent, isStatus, photoURL, userId, paperId });

    fileUploads(files, filename, paId, faId);
    cb(null, filename);
  }
});

const upload = multer({ storage }).array('files', 100);
// const upload = multer({ storage }).single('file');

// ----------------------------------------------------------------------
// Upload the file in paper
// ----------------------------------------------------------------------

exports.uploadFiles = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.files);
  });
};

function fileUploads(files, filename, paperId, filesize) {
  let filetype = '';
  if (files.mimetype.includes('image')) {
    filetype = 'image';
  } else {
    const tmpType = files.mimetype;
    fileTypes.map((fileType) => {
      if (fileType[tmpType] !== undefined) {
        filetype = fileType[tmpType];
      }
    });
  }
  const fileOrignalName = files.originalname;
  const namepiece = fileOrignalName.split('.');
  const ext = namepiece[namepiece.length - 1];
  const fileSaveName = fileOrignalName.replace(`.${ext}`, '');
  const filepath = `/static/uploads/task-files/${filename}`;
  File.create({
    name: fileSaveName,
    type: filetype,
    size: filesize,
    path: filepath,
    paperId
  });
}

exports.getPaperFiles = (req, res) => {
  File.findAll().then((files) => {
    res.status(200).send({ files });
  });
};
