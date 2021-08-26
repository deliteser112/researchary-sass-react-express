/* eslint-disable prettier/prettier */
import { useDispatch } from 'react-redux';

// redux
import { createPaper, createTask, createComment, updatePaper, updateTask, updateStatus, deletePaperPost, setAuthor } from '../redux/slices/paper';

// ----------------------------------------------------------------------

export default function usePaper() {
  const dispatch = useDispatch();

  return {
    // --------------  Creating part ---------------------
    createPaper: ({ paperData }) => dispatch(createPaper({ paperData })),
    createTask: ({ taskData }) => dispatch(createTask({ taskData })),
    createComment: ({ commentData }) => dispatch(createComment({ commentData })),
  
    // --------------  Update Paper ---------------------
    updatePaper: ({ updateData }) => dispatch(updatePaper({ updateData })),
    updateTask: ({ updateData }) => dispatch(updateTask({ updateData })),
    updateStatus: ({ statusData }) => dispatch(updateStatus({ statusData })),

    setAuthor: ({ data }) => dispatch(setAuthor({ data })),
     
    // --------------  Delete Paper ---------------------
    deletePaperPost: ({ pId }) => dispatch(deletePaperPost({ pId }))
  };
}
