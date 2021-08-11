import { createSlice } from '@reduxjs/toolkit';
import { filter } from 'lodash';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  conferenceList: []
};

const slice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // DELETE TEAM
    deleteConference(state, action) {
      const deleteConference = filter(state.conferenceList, (conference) => conference.id !== action.payload);
      state.conferenceList = deleteConference;
    },
    // GET MANAGE TEAMS
    getConferenceListSuccess(state, action) {
      state.isLoading = false;
      state.conferenceList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;
// Actions
export const { onToggleFollow, deleteConference } = slice.actions;

// ----------------------------------------------------------------------

export function getConferenceList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/conference/all-conferences');
      dispatch(slice.actions.getConferenceListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Create
// ----------------------------------------------------------------------

export function createConference({ conferenceData }) {
  const data = conferenceData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/conference/create-conference', data);
      console.log(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Update
// ----------------------------------------------------------------------

export function updateConference({ updateData }) {
  const data = updateData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log('Here is redux', data);
      const response = await axios.post('/api/conference/update-conference', data);
      console.log(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
