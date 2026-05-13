"""add user_type column

Revision ID: e2dd39221a1f
Revises: 6d54df23e585
Create Date: 2026-04-28 02:19:36.900428

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2dd39221a1f'
down_revision = '6d54df23e585'
branch_labels = None
depends_on = None


def upgrade():
    # ### FIXED VERSION ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'user_type',
                sa.String(length=20),
                nullable=False,
                server_default='customer'   # 🔥 IMPORTANT FIX
            )
        )

    # Optional: remove default after backfill (clean schema)
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('user_type', server_default=None)


def downgrade():
    # ### rollback ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('user_type')