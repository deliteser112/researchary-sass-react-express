/* eslint-disable array-callback-return */
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
// material
import { Grid, Box } from '@material-ui/core';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getFileList } from '../../../redux/slices/paper';

import FileCard from './FilesCard';
import UploadFile from './UploadFile';
// ----------------------------------------------------------------------

const logoURL = [
  {
    pdf: '/static/components/pdf.svg'
  },
  {
    image: '/static/components/image.png'
  },
  {
    word: '/static/components/word.jpg'
  },
  {
    excel: '/static/components/excel.jpg'
  },
  {
    ppt: '/static/components/ppt.jpg'
  }
];

// ---------------------------------------------------------------------- fileSize, logoURL, title, updatedDate

Files.propTypes = {
  currentPaper: PropTypes.object
};

export default function Files({ currentPaper }) {
  const dispatch = useDispatch();
  const { fileList } = useSelector((state) => state.paper);

  const [files, setFiles] = useState([]);
  useEffect(() => {
    dispatch(getFileList());
  }, [dispatch]);

  useEffect(() => {
    if (fileList.length > 0) {
      const files = [];
      const pId = currentPaper.id;
      fileList.map((file) => {
        const { id, name, paperId, path, size, type, createdAt } = file;
        if (pId === paperId) {
          const date = new Date();
          const updated = date - new Date(createdAt);
          const oneDay = 1000 * 60 * 60 * 24;
          let updatedDay = Math.floor(updated / oneDay);
          if (updatedDay > 0) {
            updatedDay = `Uploaded ${updatedDay} days ago`;
          } else {
            updatedDay = 'Uploaded today';
          }
          let logos = '';
          for (let i = 0; i < logoURL.length; i += 1) {
            if (logoURL[i][type] !== undefined) {
              logos = logoURL[i][type];
              break;
            }
          }
          const fileObj = {
            id,
            title: name,
            paperId,
            path,
            fileSize: `${size} Bytes`,
            logoURL: logos,
            updatedDate: updatedDay
          };

          files.push(fileObj);
        }
      });
      setFiles([...files]);
    }
  }, [currentPaper, fileList]);

  const handleUploadListView = () => {
    setTimeout(() => {
      dispatch(getFileList());
    }, 1000);
  };

  return (
    <>
      <Box sx={{ textAlign: 'right' }}>
        <UploadFile currentPaper={currentPaper} uploadProps={handleUploadListView} />
      </Box>
      <Box m={5} />
      <Grid container spacing={3}>
        {files.map((item, index) => (
          <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
            <FileCard
              fileId={item.id}
              fileSize={item.fileSize}
              logoURL={item.logoURL}
              title={item.title}
              updatedDate={item.updatedDate}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
