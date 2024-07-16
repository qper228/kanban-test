import React from 'react';
import Box from "@mui/material/Box";

const Container = ({ children }) => {
  return (
    <Box width="100%">
      {children}
    </Box>
  );
};

export default Container;