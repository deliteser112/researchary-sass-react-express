/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';

import { Grid, TextField, CircularProgress, InputAdornment } from '@material-ui/core';
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

ResearchTopicsForm.propTypes = {
  currentTeam: PropTypes.object,
  isEdit: PropTypes.bool,
  topics: PropTypes.array,
  recommandTopics: PropTypes.array,
  topicsFormProps: PropTypes.func
};

export default function ResearchTopicsForm({ currentTeam, recommandTopics, isEdit, topics, topicsFormProps }) {
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('title');

  const [isLoading, setIsLoading] = useState(false);

  const [basicTopics, setBasicTopics] = useState([]);
  const [originalTopics, setOriginalTopics] = useState([]);
  const [filterTopics, setFilterTopics] = useState([]);
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  useEffect(() => {
    const tags = [];
    selectedTopics.map((topic) => {
      tags.push(topic.name);
    });
    topicsFormProps([...tags]);
  }, [selectedTopics]);

  // Edit initialize...
  useEffect(() => {
    if (isEdit && currentTeam !== undefined) {
      const { topics } = currentTeam;
      const topicIds = [];
      topics.map((topic) => {
        topicIds.push(topic.id);
      });
      setSelectedTopics([...topics]);
      setSelectedTopicIds([...topicIds]);
    }
  }, [currentTeam, isEdit]);

  useEffect(() => {
    if (isEdit && currentTeam !== undefined) {
      const { topics } = currentTeam;
      const tmpRecommandTopics = recommandTopics;
      const tmpArr = [];
      topics.map((topic) => {
        let isExist = false;
        recommandTopics.map((rTopic) => {
          if (topic.id === rTopic.id) isExist = true;
        });
        if (!isExist) {
          basicTopics.map((bTopic) => {
            if (bTopic.id === topic.id) tmpArr.push(bTopic);
          });
        }
      });
      const newArr = tmpRecommandTopics.concat(tmpArr);
      setOriginalTopics([...newArr]);
    } else {
      setOriginalTopics([...recommandTopics]);
    }
  }, [currentTeam, isEdit, recommandTopics, basicTopics]);

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
  }, [selectedTopicIds, originalTopics]);

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
          fullWidth
          label="Team research topic(s)"
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
    </Grid>
  );
}
