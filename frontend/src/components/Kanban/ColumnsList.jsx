import React, {useEffect, useState} from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import { useMutation } from "@apollo/client";
import { BATCH_UPDATE_CARD, BATCH_UPDATE_COLUMN, GET_COLUMNS } from "../../graphql";

import Column from './Column';

const ColumnsList = ({ columns }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [batchUpdateColumns] = useMutation(BATCH_UPDATE_COLUMN, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });
  const [batchUpdateCards] = useMutation(BATCH_UPDATE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });

  useEffect(() => {
    setIsLoading(false);
  }, [columns]);

  const handleColumnDragEnd = (inputs) => {
    batchUpdateColumns({ variables: { inputs } })
  }

  const handleCardDragEnd = (inputs) => {
    batchUpdateCards({ variables: { inputs } })
  }

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case 'all-columns':
        if (destination.index === source.index) {
          return;
        }
        setIsLoading(true);
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(source.index, 1);
        reorderedColumns.splice(destination.index, 0, movedColumn);
        const updatedColumns = reorderedColumns.map((column, index) => ({
          id: column.id,
          order: index
        }));
        handleColumnDragEnd(updatedColumns);
        break;
      default:
        setIsLoading(true);
        const column = columns.find((o) => o.id === destination.droppableId);
        const cards = Array.from(column.cards);
        const exists = Boolean(cards.find((o) => o.id === draggableId));
        if (!exists) {
          cards.splice(destination.index, 0, {
            id: draggableId,
          });
          const updatedCards = cards.map((item, order) => ({
            id: item.id,
            columnId: destination.droppableId,
            order
          }));
          handleCardDragEnd(updatedCards)
        } else {
          const [movedCard] = cards.splice(source.index, 1);
          cards.splice(destination.index, 0, movedCard);
          const updatedCards = cards.map((item, order) => ({
            id: item.id,
            order
          }));
          handleCardDragEnd(updatedCards)
        }
        return;
    }

  };

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            p={2}
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              overflowX: 'scroll'
            }}
          >
            {columns.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Column {...item} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ColumnsList;