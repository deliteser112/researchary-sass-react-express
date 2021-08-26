import { createSlice } from '@reduxjs/toolkit';
import { filter } from 'lodash';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  paperList: [],
  publishedList: [],
  topics: [],
  recommandTopics: [],
  taskList: [],
  fileList: [],
  timelineList: [],
  commentList: []
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

    // DELETE USERS
    deletePaper(state, action) {
      const deletePaper = filter(state.paperList, (user) => user.id !== action.payload);
      state.paperList = deletePaper;
    },
    // DELETE PUBLISHED
    deletePublished(state, action) {
      const deletePublished = filter(state.publishedList, (publish) => publish.id !== action.payload);
      state.publishedList = deletePublished;
    },
    // DELETE PUBLISHED
    deleteTask(state, action) {
      const deleteTask = filter(state.taskList, (task) => task.id !== action.payload);
      state.taskList = deleteTask;
    },

    // DELETE PUBLISHED
    deleteFile(state, action) {
      const deleteFile = filter(state.fileList, (file) => file.id !== action.payload);
      state.fileList = deleteFile;
    },

    // GET MANAGE USERS
    getPaperListSuccess(state, action) {
      state.isLoading = false;
      state.paperList = action.payload;
    },

    // GET MANAGE Published
    getPublishedListSuccess(state, action) {
      state.isLoading = false;
      state.publishedList = action.payload;
    },

    // GET TOPICS
    getTopicsSuccess(state, action) {
      state.isLoading = false;
      state.topics = action.payload;
    },
    // GET RECOMMAND TOPICS
    getRecommandTopicsSuccess(state, action) {
      state.isLoading = false;
      state.recommandTopics = action.payload;
    },

    // GET MANAGE TASKS
    getTaskListSuccess(state, action) {
      state.isLoading = false;
      state.taskList = action.payload;
    },
    // GET MANAGE COMMENTS
    getCommentListSuccess(state, action) {
      state.isLoading = false;
      state.commentList = action.payload;
    },

    // GET MANAGE FILES
    getFileListSuccess(state, action) {
      state.isLoading = false;
      state.fileList = action.payload;
    },
    // GET MANAGE TIMELINES
    getTimelineListSuccess(state, action) {
      state.isLoading = false;
      state.timelineList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;
// Actions
export const { onToggleFollow, deletePaper, deletePublished, deleteTask, deleteFile } = slice.actions;

// ----------------------------------------------------------------------

export function getTopics() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/topics');
      dispatch(slice.actions.getTopicsSuccess(response.data.topics));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRecommandTopics() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/recommand-topics');
      dispatch(slice.actions.getRecommandTopicsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPaperList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/all-papers');
      dispatch(slice.actions.getPaperListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPublishedList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/published-papers');
      dispatch(slice.actions.getPublishedListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTaskList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/paper-tasks');
      dispatch(slice.actions.getTaskListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFileList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/paper-files');
      dispatch(slice.actions.getFileListSuccess(response.data.files));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCommentList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/paper-comments');
      dispatch(slice.actions.getCommentListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function getTimelineList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/paper/paper-timelines');
      dispatch(slice.actions.getTimelineListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Create
// ----------------------------------------------------------------------

export function createPaper({ paperData }) {
  const data = paperData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/create-paper', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createTask({ taskData }) {
  const data = taskData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/create-task', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createComment({ commentData }) {
  const data = commentData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/create-comment', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Update
// ----------------------------------------------------------------------

export function updatePaper({ updateData }) {
  const data = updateData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/update-paper', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateTask({ updateData }) {
  const data = updateData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/update-task', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateStatus({ statusData }) {
  const data = statusData;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/update-status', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setAuthor({ data }) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/update-authors', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Delete part
// ----------------------------------------------------------------------

export function deletePaperPost({ pId }) {
  const data = pId;
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/paper/delete-paper', data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
