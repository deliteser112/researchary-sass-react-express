/* eslint-disable prettier/prettier */
import { useDispatch } from 'react-redux';

// redux
import { createPaper, createTask, updatePaper, updateTask, updateStatus } from '../redux/slices/paper';

// ----------------------------------------------------------------------

export default function usePaper() {
  const dispatch = useDispatch();

  return {
    // --------------  Creating part ---------------------
    createPaper: ({ paperData }) => dispatch(createPaper({ paperData })),
    createTask: ({ taskData }) => dispatch(createTask({ taskData })),
  
    // --------------  Update Paper ---------------------
    updatePaper: ({ updateData }) => dispatch(updatePaper({ updateData })),
    updateTask: ({ updateData }) => dispatch(updateTask({ updateData })),
    updateStatus: ({ statusData }) => dispatch(updateStatus({ statusData }))
  };
}
