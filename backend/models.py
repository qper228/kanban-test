import boto3
from boto3.dynamodb.conditions import Key

from config import DB_CONFIG

dynamodb = boto3.resource('dynamodb', **DB_CONFIG)


def create_tables():
    existing_tables = dynamodb.tables.all()
    if 'Columns' not in existing_tables:
        table = dynamodb.create_table(
            TableName='Columns',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='Columns')

    if 'Cards' not in existing_tables:
        table = dynamodb.create_table(
            TableName='Cards',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'column_id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            },
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'ColumnIndex',
                    'KeySchema': [
                        {
                            'AttributeName': 'column_id',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ]
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='Cards')

create_tables()

columns_table = dynamodb.Table('Columns')
cards_table = dynamodb.Table('Cards')

class ColumnModel:
    def __init__(self, id, title, order):
        self.id = id
        self.title = title
        self.order = order

    @staticmethod
    def get_all():
        response = columns_table.scan()
        return [ColumnModel(**item) for item in response.get('Items', [])]

    @staticmethod
    def get_by_id(column_id):
        response = columns_table.get_item(Key={'id': column_id})
        item = response.get('Item')
        if item:
            return ColumnModel(**item)
        return None

    def save(self):
        columns_table.put_item(Item=self.__dict__)

    @staticmethod
    def delete(column_id):
        columns_table.delete_item(Key={'id': column_id})


class CardModel:
    def __init__(self, id, title, description, order, column_id):
        self.id = id
        self.title = title
        self.description = description
        self.order = order
        self.column_id = column_id

    @staticmethod
    def get_all():
        response = cards_table.scan()
        return [CardModel(**item) for item in response.get('Items', [])]

    @staticmethod
    def get_by_column_id(column_id):
        response = cards_table.query(
            IndexName='ColumnIndex',
            KeyConditionExpression=Key('column_id').eq(column_id)
        )
        return sorted([CardModel(**item) for item in response.get('Items', [])], key=lambda column: column.order)

    @staticmethod
    def get_by_id(card_id):
        response = cards_table.get_item(Key={'id': card_id})
        item = response.get('Item')
        if item:
            return CardModel(**item)
        return None

    def save(self):
        cards_table.put_item(Item=self.__dict__)

    @staticmethod
    def delete(card_id):
        cards_table.delete_item(Key={'id': card_id})