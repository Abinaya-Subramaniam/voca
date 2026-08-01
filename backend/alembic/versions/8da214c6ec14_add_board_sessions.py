"""add board_sessions

Revision ID: 8da214c6ec14
Revises: 57a4dfce53b4
Create Date: 2026-07-29 18:19:18.708942

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8da214c6ec14'
down_revision: Union[str, Sequence[str], None] = '57a4dfce53b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('board_sessions',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('profile_id', sa.String(length=32), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=32), nullable=False),
    sa.Column('device_label', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('last_seen_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['profile_id'], ['profiles.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_board_sessions_profile_id'), 'board_sessions', ['profile_id'], unique=False)
    op.create_index(op.f('ix_board_sessions_created_by_user_id'), 'board_sessions', ['created_by_user_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_board_sessions_created_by_user_id'), table_name='board_sessions')
    op.drop_index(op.f('ix_board_sessions_profile_id'), table_name='board_sessions')
    op.drop_table('board_sessions')
