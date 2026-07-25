"""add chat_messages

Revision ID: 57a4dfce53b4
Revises: b1c8f60c23db
Create Date: 2026-07-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '57a4dfce53b4'
down_revision: Union[str, Sequence[str], None] = 'b1c8f60c23db'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('chat_messages',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('profile_id', sa.String(length=32), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('steps', sa.JSON(), nullable=False),
    sa.Column('pending_action', sa.JSON(), nullable=True),
    sa.Column('action_status', sa.String(length=20), nullable=True),
    sa.Column('action_added_count', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['profile_id'], ['profiles.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chat_messages_profile_id'), 'chat_messages', ['profile_id'], unique=False)
    op.create_index(op.f('ix_chat_messages_created_at'), 'chat_messages', ['created_at'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_chat_messages_created_at'), table_name='chat_messages')
    op.drop_index(op.f('ix_chat_messages_profile_id'), table_name='chat_messages')
    op.drop_table('chat_messages')
