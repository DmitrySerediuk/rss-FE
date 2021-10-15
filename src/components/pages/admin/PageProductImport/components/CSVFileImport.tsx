import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

function setAuthTokenToLocalStorage(defaultKey='authToken'){
  localStorage.setItem(defaultKey, 'RG1pdHJ5U2VyZWRpdWs6VEVTVF9QQVNTV09SRA==');
}

function getAuthTokenToLocalStorage(defaultKey = 'authToken'){
  return localStorage.getItem(defaultKey);
}


export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
    await setAuthTokenToLocalStorage();
    let authToken = getAuthTokenToLocalStorage();
    console.log('run csv head')
      // Get the presigned URL
      const response = await axios({
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`
        },
        url,
        params: {
          name: encodeURIComponent(file.name)
        }
      })
      console.log('File to upload: ', file.name)
      console.log('Uploading to: ', response.data.message)
      const result = await fetch(response.data.message, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: file
      })
      console.log('Result: ', result)
      setFile('');
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
