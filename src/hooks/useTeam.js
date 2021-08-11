/* eslint-disable prettier/prettier */
import { useDispatch } from 'react-redux';

// redux
import { createTeam, updateTeam } from '../redux/slices/team';

// ----------------------------------------------------------------------

export default function usePaper() {
  const dispatch = useDispatch();

  return {
    // --------------  Creating part ---------------------
    createTeam: ({ teamData }) => dispatch(createTeam({ teamData })),
    updateTeam: ({ updateData }) => dispatch(updateTeam({ updateData }))
  };
}
