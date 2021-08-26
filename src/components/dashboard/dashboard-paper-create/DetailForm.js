/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PublicIcon from '@material-ui/icons/Public';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
// material
import {
  TextField,
  Typography,
  Box,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Grid,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

// component
import { QuillEditor } from '../../editor';
import TopicTagButton from '../../TopicTagButton';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((topic) => topic.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

DetailForm.propTypes = {
  validation: PropTypes.object,
  currentPaper: PropTypes.object,
  isEdit: PropTypes.bool,
  topics: PropTypes.array,
  recommandTopics: PropTypes.array,
  privacies: PropTypes.array,
  detailFormProps: PropTypes.func
};

export default function DetailForm({
  validation,
  currentPaper,
  isEdit,
  topics,
  recommandTopics,
  privacies,
  detailFormProps
}) {
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('title');

  const [isLoading, setIsLoading] = useState(false);

  const [privacy, setPrivacy] = useState(0);
  const [openRequest, setOpenRequest] = useState(false);

  const [basicTopics, setBasicTopics] = useState([]);
  const [originalTopics, setOriginalTopics] = useState([]);
  const [filterTopics, setFilterTopics] = useState([]);
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [detailFormData, setDetailFormData] = useState({});

  const [hasTitle, setHasTitle] = useState(false);
  const [hasTitleErrorText, setHasTitleErrorText] = useState('');

  useEffect(() => {
    setOrder('asc');
    setOrderBy('setOrderBy');
  }, []);

  useEffect(() => {
    setBasicTopics([...topics]);
  }, [topics]);

  // set filtered topics when user types to search the topics
  useEffect(() => {
    if (searchTopic.length > 0) {
      const tmpTopics = [];
      basicTopics.map((topic) => {
        let isSelected = false;
        selectedTopicIds.map((topicId) => {
          if (topic.id === topicId) {
            isSelected = true;
          }
        });
        if (!isSelected) {
          tmpTopics.push(topic);
        }
      });
      setFilterTopics([...tmpTopics]);
    } else {
      const orgTopics = originalTopics;
      selectedTopics.map((selTopic) => {
        let isExist = false;
        originalTopics.map((orgTopic) => {
          if (selTopic.id === orgTopic.id) isExist = true;
        });
        if (!isExist) {
          orgTopics.push(selTopic);
        }
      });
      setFilterTopics([...orgTopics]);
    }
  }, [searchTopic, originalTopics, selectedTopics]);

  useEffect(() => {
    const tmpSelTopics = []; // selected Topics
    let tmpChangeSearchRange = [];
    tmpChangeSearchRange = searchTopic.length > 0 ? basicTopics : originalTopics;
    tmpChangeSearchRange.map((topic) => {
      selectedTopicIds.map((sTopic) => {
        if (topic.id === sTopic) {
          tmpSelTopics.push(topic);
        }
      });
    });
    setSelectedTopics([...tmpSelTopics]); // selected Topics
  }, [selectedTopicIds]);

  // Edit initialize...
  useEffect(() => {
    if (isEdit && currentPaper !== undefined) {
      const { topics } = currentPaper;
      setSelectedTopicIds([...topics]);
    }
  }, [currentPaper, isEdit]);

  // Edit
  useEffect(() => {
    if (isEdit && currentPaper !== undefined) {
      const { title, description, privacy, topics, openRequest } = currentPaper;
      setTitle(title);
      setDescription(description);
      setPrivacy(privacy);
      setOpenRequest(!!openRequest);

      const tmpRecommandTopics = recommandTopics;
      const tmpArr = [];
      topics.map((topic) => {
        let isExist = false;
        recommandTopics.map((rTopic) => {
          if (topic === rTopic.id) isExist = true;
        });
        if (!isExist) {
          basicTopics.map((bTopic) => {
            if (bTopic.id === topic) tmpArr.push(bTopic);
          });
        }
      });
      const newArr = tmpRecommandTopics.concat(tmpArr);
      setOriginalTopics([...newArr]);
    } else {
      setOriginalTopics([...recommandTopics]);
    }
  }, [currentPaper, isEdit, recommandTopics, basicTopics]);

  useEffect(() => {
    const tags = [];
    selectedTopics.map((topic) => {
      tags.push(topic.name);
    });
    const detailObj = {
      description,
      title,
      tags,
      privacy,
      openRequest
    };
    setDetailFormData({ ...detailObj });
  }, [description, title, selectedTopics, privacy, openRequest]);

  useEffect(() => {
    detailFormProps(detailFormData);
  }, [detailFormData]);

  useEffect(() => {
    if (validation.title) {
      setHasTitle(true);
      setHasTitleErrorText('The title is required!');
    }
  }, [validation]);

  const handleChangeTitle = (e) => {
    if (e.target.value.length === 0) {
      setHasTitle(true);
      setHasTitleErrorText('The title is required!');
    } else {
      setHasTitle(false);
      setHasTitleErrorText('');
    }
    setTitle(e.target.value);
  };

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 13: {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          const newTopic = event.target.value;
          const newId = 100 + basicTopics.length;
          let isExist = false;
          basicTopics.map((topic) => {
            if (topic.name === newTopic) {
              isExist = true;
            }
          });

          if (!isExist) {
            setSelectedTopicIds([...selectedTopicIds, newId]);
            setOriginalTopics([...originalTopics, { id: newId, name: newTopic }]);
            setBasicTopics([...basicTopics, { id: newId, name: newTopic }]);
          }
        }
        break;
      }
      default:
    }
  };

  const handleChangePrivacy = (event) => {
    setPrivacy(event.target.value);
  };

  const handleChangeOpenRequest = () => {
    setOpenRequest(!openRequest);
  };

  const handleSelctTopics = (selTopics) => {
    setSelectedTopicIds([...selTopics]);
  };

  const handleSearchTopic = (e) => {
    setSearchTopic(e.target.value);
  };

  const handleFocusText = () => {
    setIsLoading(true);
  };

  const handleLostFocus = () => {
    setIsLoading(false);
  };

  const filteredTopics = applySortFilter(filterTopics, getComparator(order, orderBy), searchTopic);

  return (
    <Grid container spacing={3.5} dir="ltr">
      <Grid item xs={12}>
        <TextField
          error={hasTitle}
          helperText={hasTitleErrorText}
          fullWidth
          label="Paper title"
          value={title}
          onChange={handleChangeTitle}
          placeholder="Type the paper title..."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Description (Optional)</Typography>
        <QuillEditor
          id="post-content"
          value={description}
          onChange={setDescription}
          placeholder="Type the abstract or some information about the paper..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Paper research topic(s)"
          value={searchTopic}
          onFocus={handleFocusText}
          onBlur={handleLostFocus}
          onChange={handleSearchTopic}
          onKeyDown={handleKeyDown}
          placeholder="Type the research topic..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {searchTopic.length > 0 && (
          <TopicTagButton
            selectedTopics={selectedTopicIds}
            topics={selectedTopics}
            onSelectTopics={handleSelctTopics}
            sx={{ marginBottom: 0 }}
          />
        )}
        <TopicTagButton topics={filteredTopics} selectedTopics={selectedTopicIds} onSelectTopics={handleSelctTopics} />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" sx={{ width: '100%' }}>
          <InputLabel id="demo-simple-select-outlined-label">Privacy</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={privacy}
            onChange={handleChangePrivacy}
            label="Privacy"
          >
            {privacies.map((item, index) => (
              <MenuItem key={index} value={index}>
                <Box sx={{ display: 'flex' }}>
                  {index === 0 && <PublicIcon sx={{ mr: 2 }} />}
                  {index === 1 && <PeopleAltIcon sx={{ mr: 2 }} />}
                  {index === 2 && <LockIcon sx={{ mr: 2 }} />}
                  {index === 3 && <PersonIcon sx={{ mr: 2 }} />}
                  <Box>
                    <Typography variant="body2">{item.title}</Typography>
                    <Typography variant="caption" sx={{ ...(privacy === index && { display: 'none' }) }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox checked={openRequest} onChange={handleChangeOpenRequest} name="antoine" />}
          label="Open for anyone to request co-authering this paper"
        />
      </Grid>
    </Grid>
  );
}
