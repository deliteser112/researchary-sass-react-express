import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { Typography, ToggleButtonGroup, ToggleButton } from '@material-ui/core';

TopicTagButton.propTypes = {
  topics: PropTypes.array,
  selectedTopics: PropTypes.array,
  onSelectTopics: PropTypes.func,
  sx: PropTypes.object
};

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))(ToggleButtonGroup);

export default function TopicTagButton({ topics, selectedTopics, onSelectTopics, sx }) {
  const theme = useTheme();

  const [selectTopics, setSelectTopics] = useState([]);

  useEffect(() => {
    setSelectTopics(selectedTopics);
  }, [selectedTopics]);

  const handleSelectTopics = (event, newTopics) => {
    onSelectTopics(newTopics);
    setSelectTopics(newTopics);
  };

  return (
    <StyledToggleButtonGroup
      value={selectTopics}
      onChange={handleSelectTopics}
      aria-label="team category"
      sx={{ display: 'block', textAlign: 'left', mb: 3, ...sx }}
    >
      {topics.map((item, index) => (
        <ToggleButton
          key={index}
          value={item.id}
          sx={{
            px: 3,
            py: 0.5,
            borderColor: theme.palette.primary.main,
            borderRadius: `${theme.spacing(3)} !important`,
            color: theme.palette.primary.main,
            borderLeft: `1px solid ${theme.palette.primary.main} !important`,
            '&.Mui-selected': {
              color: 'white',
              backgroundColor: theme.palette.primary.main
            },
            '&.Mui-selected:hover': {
              backgroundColor: theme.palette.primary.main
            },
            ...sx
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 100 }}>
            {item.name}
          </Typography>
        </ToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
}
