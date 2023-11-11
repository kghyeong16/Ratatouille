import { Box } from '@mui/material';
import React from 'react';


export default function notFound(){
    return(
      <Box id="container" sx={{ margin:'auto',
      px:'10px',
      maxWidth:'768px',
      border:'1px solid #D0D0D0',
      boxShadow:'0 0 8px #D0D0D0'}}>
		<h1>404 Page Not Found</h1>
		<p>The page you requested was not found.</p>
      </Box>
    )

}