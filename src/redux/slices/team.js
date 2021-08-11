import { createSlice } from '@reduxjs/toolkit';
import { filter } from 'lodash';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  teamList: []
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
    deleteTeam(state, action) {
      const deleteTeam = filter(state.teamList, (team) => team.id !== action.payload);
      state.teamList = deleteTeam;
    },
    // GET MANAGE TEAMS
    getTeamListSuccess(state, action) {
      state.isLoading = false;
      state.teamList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;
// Actions
export const { onToggleFollow, deleteTeam } = slice.actions;

// ----------------------------------------------------------------------

export function getTeamList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/team/all-teams');
      dispatch(slice.actions.getTeamListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Create
// ----------------------------------------------------------------------

export function createTeam({ teamData }) {
  const data = teamData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/team/create-team', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Update
// ----------------------------------------------------------------------

export function updateTeam({ updateData }) {
  const data = updateData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/team/update-team', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
