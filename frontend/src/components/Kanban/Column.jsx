import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { CREATE_CARD, DELETE_COLUMN, GET_COLUMNS, UPDATE_COLUMN } from "../../graphql";
import { Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { Droppable } from "react-beautiful-dnd";

import Task from "./Task";

const Header = ({ title, onEditClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <IconButton onClick={onEditClick}>
        <EditIcon />
      </IconButton>
    </Box>
  )
}

const EditInput = ({ defaultValue, onSaveClick }) => {
  const [value, setValue] = useState(defaultValue);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setValue(value);
  }

  const handleSaveClick = () => {
    onSaveClick(value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <TextField
        variant="standard"
        defaultValue={defaultValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        autoFocus
      />
      <IconButton onClick={handleSaveClick}>
        <DoneIcon />
      </IconButton>
    </Box>
  )
}

const Column = ({ id, title, cards }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateColumn] = useMutation(UPDATE_COLUMN, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });
  const [deleteColumn] = useMutation(DELETE_COLUMN, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });
  const [createCard] = useMutation(CREATE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const handleSave = (title) => {
    updateColumn({ variables: { id, input: { title } } }).then(() => {
      setIsEditing(false);
    });
  }

  const handleDelete = () => {
    deleteColumn({ variables: { id }});
  }

  const handleAddTask = () => {
    createCard({
      variables: {
        input: {
          title: 'New Card',
          description: '',
          columnId: id
        }
      }
    })
  }

  return (
    <Card sx={{ width: 275 }}>
      <CardContent>
        {isEditing ? (
          <EditInput
            defaultValue={title}
            onSaveClick={handleSave}
          />
        ) : (
          <Header
            title={title}
            onEditClick={handleEditClick}
          />
        )}
        <Droppable droppableId={id} type="task">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {cards.length === 0 && (
                <Typography variant="body2">No Tasks available</Typography>
              )}
              {cards.map((card, index) => (
                <Task
                  key={card.id}
                  index={index}
                  {...card}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <Button
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default Column;