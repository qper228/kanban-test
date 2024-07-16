import graphene
import uuid

from graphene import relay, ObjectType
from graphene.types import InputObjectType

from models import ColumnModel, CardModel

class ColumnType(ObjectType):
    class Meta:
        interfaces = (relay.Node,)

    id = graphene.ID(required=True)
    title = graphene.String()
    order = graphene.Int(required=False)
    cards = graphene.List(lambda: CardType)

    def resolve_cards(self, info):
        return CardModel.get_by_column_id(self.id)

class CardType(ObjectType):
    class Meta:
        interfaces = (relay.Node,)

    id = graphene.ID(required=True)
    title = graphene.String()
    description = graphene.String()
    order = graphene.Int()
    column_id = graphene.String()

class ColumnInput(InputObjectType):
    id = graphene.String(required=False)
    title = graphene.String()
    order = graphene.Int(required=False)

class CardInput(InputObjectType):
    id = graphene.String(required=False)
    title = graphene.String()
    description = graphene.String()
    order = graphene.Int()
    column_id = graphene.String()

class CreateColumn(graphene.Mutation):
    class Arguments:
        input = ColumnInput(required=True)

    column = graphene.Field(lambda: ColumnType)

    def mutate(self, info, input):
        column = ColumnModel(
            id=str(uuid.uuid4()),
            order=len(ColumnModel.get_all()),
            **input
        )
        column.save()
        return CreateColumn(column=column)

class UpdateColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = ColumnInput()

    column = graphene.Field(lambda: ColumnType)

    def mutate(self, info, id, input):
        column = ColumnModel.get_by_id(id)
        if column:
            for key, value in input.items():
                setattr(column, key, value)
            column.save()
        return UpdateColumn(column=column)


class BatchUpdateColumn(graphene.Mutation):
    class Arguments:
        inputs = graphene.List(ColumnInput, required=True)

    columns = graphene.List(lambda: ColumnType)

    def mutate(self, info, inputs):
        columns = []
        for input_data in inputs:
            column = ColumnModel.get_by_id(input_data.id)
            if column:
                for key, value in input_data.items():
                    if key != 'id':
                        setattr(column, key, value)
                column.save()
                columns.append(column)
            else:
                raise Exception(f'Column with id {input_data.id} not found')
        return BatchUpdateColumn(columns=columns)


class DeleteColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        ColumnModel.delete(id)
        return DeleteColumn(success=True)

class CreateCard(graphene.Mutation):
    class Arguments:
        input = CardInput(required=True)

    card = graphene.Field(lambda: CardType)

    def mutate(self, info, input):
        column_cards = [item for item in CardModel.get_all() if item.column_id == input.column_id]
        card = CardModel(
            id=str(uuid.uuid4()),
            order=len(column_cards),
            **input
        )
        card.save()
        return CreateCard(card=card)

class UpdateCard(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = CardInput()

    card = graphene.Field(lambda: CardType)

    def mutate(self, info, id, input):
        card = CardModel.get_by_id(id)
        if card:
            for key, value in input.items():
                setattr(card, key, value)
            card.save()
        return UpdateCard(card=card)


class BatchUpdateCard(graphene.Mutation):
    class Arguments:
        inputs = graphene.List(CardInput, required=True)

    cards = graphene.List(lambda: CardType)

    def mutate(self, info, inputs):
        cards = []
        for input_data in inputs:
            card = CardModel.get_by_id(input_data.id)
            if card:
                for key, value in input_data.items():
                    if key != 'id':
                        setattr(card, key, value)
                card.save()
                cards.append(card)
            else:
                raise Exception(f'Card with id {input_data.id} not found')
        return BatchUpdateCard(cards=cards)


class DeleteCard(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        CardModel.delete(id)
        return DeleteCard(success=True)

class Mutation(graphene.ObjectType):
    create_column = CreateColumn.Field()
    update_column = UpdateColumn.Field()
    batch_update_column = BatchUpdateColumn.Field()
    delete_column = DeleteColumn.Field()
    create_card = CreateCard.Field()
    update_card = UpdateCard.Field()
    batch_update_card = BatchUpdateCard.Field()
    delete_card = DeleteCard.Field()

class Query(ObjectType):
    node = relay.Node.Field()
    all_columns = graphene.List(ColumnType)
    all_cards = graphene.List(CardType)
    cards_by_column = graphene.List(CardType, column_id=graphene.String(required=True))

    def resolve_all_columns(self, info):
        columns = ColumnModel.get_all()
        return sorted(columns, key=lambda column: column.order)

    def resolve_all_cards(self, info):
        return CardModel.get_all()

    def resolve_cards_by_column(self, info, column_id):
        return CardModel.get_by_column_id(column_id)

schema = graphene.Schema(query=Query, mutation=Mutation)