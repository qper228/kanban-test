import { gql } from '@apollo/client';

export const GET_COLUMNS = gql`
  query GetColumns {
    allColumns {
      id
      title
      order
      cards {
        id
        title
        description
        order
        columnId
      }
    }
  }
`;

export const CREATE_COLUMN = gql`
  mutation CreateColumn($input: ColumnInput!) {
    createColumn(input: $input) {
      column {
        id
        title
        order
      }
    }
  }
`;

export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($id: String!, $input: ColumnInput!) {
    updateColumn(id: $id, input: $input) {
      column {
        id
        title
        order
      }
    }
  }
`;

export const BATCH_UPDATE_COLUMN = gql`
  mutation BatchUpdateColumn($inputs: [ColumnInput!]!) {
    batchUpdateColumn(inputs: $inputs) {
      columns {
        id
        title
        order
      }
    }
  }
`;

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: String!) {
    deleteColumn(id: $id) {
      success
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($input: CardInput!) {
    createCard(input: $input) {
      card {
        id
        title
        description
        order
        columnId
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: String!, $input: CardInput!) {
    updateCard(id: $id, input: $input) {
      card {
        id
        title
        description
        order
        columnId
      }
    }
  }
`;

export const BATCH_UPDATE_CARD = gql`
  mutation BatchUpdateCard($inputs: [CardInput!]!) {
    batchUpdateCard(inputs: $inputs) {
      cards {
        id
        order
        columnId
      }
    }
  }
`;


export const DELETE_CARD = gql`
  mutation DeleteCard($id: String!) {
    deleteCard(id: $id) {
      success
    }
  }
`;
