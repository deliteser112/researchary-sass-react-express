/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PostAddIcon from '@material-ui/icons/PostAdd';
// material
import {
  Link,
  Card,
  Stack,
  Paper,
  Avatar,
  TextField,
  Typography,
  CardHeader,
  IconButton,
  InputAdornment
} from '@material-ui/core';
// utils
import { fDate } from '../../../utils/formatTime';
// hooks
import useAuth from '../../../hooks/useAuth';
import usePaper from '../../../hooks/usePaper';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getCommentList } from '../../../redux/slices/paper';
//
import MyAvatar from '../../MyAvatar';
import EmojiPicker from '../../EmojiPicker';

// ----------------------------------------------------------------------

Comments.propTypes = {
  currentPaper: PropTypes.object
};

export default function Comments({ currentPaper }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { createComment } = usePaper();
  const { commentList } = useSelector((state) => state.paper);

  const [comments, setComments] = useState([]);

  const commentInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [paperId, setPaperId] = useState(0);

  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(getCommentList());
  }, [dispatch]);

  useEffect(() => {
    const { id } = currentPaper;
    setPaperId(id);
  }, [currentPaper]);

  useEffect(() => {
    if (commentList.length > 0) {
      const tmpComments = [];
      commentList.map((comment) => {
        if (paperId === comment.paperId) {
          tmpComments.push(comment);
        }
      });
      setComments([...tmpComments]);
    }
  }, [commentList, paperId]);

  const hasComments = comments.length > 0;

  const handleChangeMessage = (event) => {
    setComment(event.target.value);
  };

  const handleSaveComment = async () => {
    if (comment.length > 0) {
      const tmpComments = comments;
      tmpComments.push({
        user: {
          photoURL: user.photoURL,
          name: `${user.firstname} ${user.lastname}`
        },
        comment,
        createdAt: new Date()
      });
      setComment('');
      setComments([...tmpComments]);
      const commentData = { comment, paperId };
      await createComment({ commentData });
    }
  };

  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardHeader
        disableTypography
        avatar={<MyAvatar />}
        title={
          <Link to="#" variant="subtitle2" color="text.primary" component={RouterLink}>
            {user.firstname} {user.lastname}
          </Link>
        }
        subheader={
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {fDate(new Date())}
          </Typography>
        }
        action={
          <IconButton>
            <Icon icon={moreVerticalFill} width={20} height={20} />
          </IconButton>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center">
          {hasComments && (
            <Stack spacing={1.5}>
              {comments.map((comment, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <Avatar alt={comment.user.name} src={comment.user.photoURL} />
                  <Paper sx={{ p: 1.5, flexGrow: 0, bgcolor: 'background.neutral' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ sm: 'center' }}
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle2" sx={{ mr: 2 }}>
                        {comment.user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {fDate(comment.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                      {comment.comment}
                    </Typography>
                  </Paper>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
        <Stack direction="row" alignItems="center">
          <MyAvatar />
          <TextField
            fullWidth
            size="small"
            value={comment}
            inputRef={commentInputRef}
            placeholder="Write a comment…"
            onChange={handleChangeMessage}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmojiPicker alignRight value={comment} setValue={setComment} />
                </InputAdornment>
              )
            }}
            sx={{
              ml: 2,
              mr: 1,
              '& fieldset': {
                borderWidth: `1px !important`,
                borderColor: (theme) => `${theme.palette.grey[500_32]} !important`
              }
            }}
          />
          <IconButton onClick={handleSaveComment}>
            <PostAddIcon />
          </IconButton>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
        </Stack>
      </Stack>
    </Card>
  );
}
