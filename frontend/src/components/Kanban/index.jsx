import React from 'react';

import { CREATE_COLUMN, GET_COLUMNS } from "../../graphql";
import { useMutation, useQuery } from "@apollo/client";

import Container from './Container';
import Header from './Header';
import Columns from './ColumnsList';


const KanbanBoard = () => {
  const { loading: loadingColumns, data } = useQuery(GET_COLUMNS);
  const { allColumns = []} = data || {};
  const [createColumn] = useMutation(CREATE_COLUMN, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });

  const handleCreateColumnClick = () => {
    createColumn({
      variables: {
        input: {
          title: 'New Column',
        }
      }
    })
  }

  return (
    <Container>
      <Header
        onAddButtonClick={handleCreateColumnClick}
      />
      {!loadingColumns && allColumns.length > 0 && (
        <Columns columns={allColumns} />
      )}
    </Container>
  );
};

export default KanbanBoard;