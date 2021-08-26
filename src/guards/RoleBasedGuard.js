/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Alert, AlertTitle } from '@material-ui/core';

import { getPaperList } from '../redux/slices/paper';
import { useDispatch, useSelector } from '../redux/store';
// hooks
import useAuth from '../hooks/useAuth';
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  children: PropTypes.node
};

export default function RoleBasedGuard({ children }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { paperId } = useParams();
  const isEdit = pathname.includes('edit');
  const { paperList } = useSelector((state) => state.paper);
  const currentPaper = paperList.find((paper) => paper.id === Number(paperId));

  const { user } = useAuth();

  const [accessiblePapers, setAccessiblePapers] = useState([]);
  const [currentUser, setCurrentUser] = useState(0);

  useEffect(() => {
    dispatch(getPaperList());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && currentPaper !== undefined) {
      const { authors } = currentPaper;
      const tmpAuhtorIds = [];
      authors.map((author) => {
        tmpAuhtorIds.push(author.id);
      });
      setAccessiblePapers([...tmpAuhtorIds]);
      setCurrentUser(user.id);
    }
  }, [currentPaper, isEdit, user]);

  if (!accessiblePapers.includes(currentUser)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
