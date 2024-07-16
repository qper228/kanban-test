import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Header({
  title = 'Kanban Board',
  onAddButtonClick = () => {},
}) {
  return (
    <Box flexGrow={1}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button
            onClick={onAddButtonClick}
            color="inherit"
          >
            Add Column
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}