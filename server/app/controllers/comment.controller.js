const jwt = require('jsonwebtoken');
const db = require('../models');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const Comment = db.comment;
const User = db.user;

// ----------------------------------------------------------------------
// Create commment to paper
// ----------------------------------------------------------------------

exports.createComment = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  const { paperId, comment } = req.body;
  Comment.create({ comment, paperId, userId });
  res.status(200).send({ message: 'success' });
};

// ----------------------------------------------------------------------
// Get all comment by paperId
// ----------------------------------------------------------------------

exports.getPaperComments = (req, res) => {
  Comment.findAll().then(async (comments) => {
    const commentList = await getComments(comments);
    res.status(200).send(commentList);
  });
};

async function getComments(comments) {
  const asyncRes = await Promise.all(
    comments.map(async (cData) => {
      const { id, comment, paperId, userId, createdAt } = cData;
      const userInfo = await User.findOne({ where: { id: userId } });
      const { photoURL, firstname, lastname } = userInfo;
      const user = { photoURL, name: `${firstname} ${lastname}` };

      const res = {
        id,
        user,
        comment,
        createdAt: createdAt.toISOString().split('T')[0],
        paperId
      };
      return res;
    })
  );
  return asyncRes;
}
