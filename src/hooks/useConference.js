/* eslint-disable prettier/prettier */
import { useDispatch } from 'react-redux';

// redux
import { createConference, updateConference } from '../redux/slices/conference';

// ----------------------------------------------------------------------

export default function usePaper() {
  const dispatch = useDispatch();

  return {
    // --------------  Creating part ---------------------
    createConference: ({ conferenceData }) => dispatch(createConference({ conferenceData })),
    updateConference: ({ updateData }) => dispatch(updateConference({ updateData }))
  };
}
