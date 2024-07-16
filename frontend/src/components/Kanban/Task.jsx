import React, {useState} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Draggable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_CARD, GET_COLUMNS, UPDATE_CARD } from "../../graphql";

const EditDialog = ({ isOpen, onClose, title, description, onSubmit, onDelete }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData).entries());
    onSubmit(formJson);
    onClose();
  }

  const handleDelete = () => {
    onClose();
    onDelete();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box width="100%">
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={title}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={description}
            multiline
            minRows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          justifyContent="space-between"
          display="flex"
          width="100%"
        >
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          <Button
            type="submit"
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

const Task = ({ id, title, description, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [updateCard] = useMutation(UPDATE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });
  const [deleteCard] = useMutation(DELETE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });

  const handleDoubleClick = () => {
    setIsDialogOpen(true);
  }

  const handleEditTask = (input) => {
    updateCard({
      variables: { id, input }
    });
  }

  const handleDeleteTask = () => {
    deleteCard({
      variables: { id }
    });
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Paper
            elevation={2}
            onDoubleClick={handleDoubleClick}
          >
            <Box
              bgcolor="#f0f0f0"
              p={1}
              mb={1}
            >
              <Typography variant="body1">
                {title}
              </Typography>
              <Typography variant="caption">
                {description}
              </Typography>
            </Box>
            <EditDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title={title}
              description={description}
              onSubmit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </Paper>
        </div>
      )}
    </Draggable>
  );
};

export default Task;