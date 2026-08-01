from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_owned_profile, get_shared_profile
from ..database import get_db
from ..models import Board, BoardSymbol, Profile
from ..schemas import BoardCreate, BoardOut, BoardSymbolIn, BoardUpdate, ReorderRequest

router = APIRouter(prefix="/api/profiles/{profile_id}/boards", tags=["boards"])


def _get_board(db: Session, profile: Profile, board_id: str) -> Board:
    board = db.get(Board, board_id)
    if board is None or board.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Board not found")
    return board


@router.get("", response_model=list[BoardOut])
def list_boards(profile: Profile = Depends(get_shared_profile), db: Session = Depends(get_db)):
    return db.scalars(
        select(Board).where(Board.profile_id == profile.id).order_by(Board.is_root.desc(), Board.name)
    ).all()


@router.post("", response_model=BoardOut, status_code=status.HTTP_201_CREATED)
def create_board(
    body: BoardCreate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = Board(profile_id=profile.id, name=body.name, category=body.category)
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.patch("/{board_id}", response_model=BoardOut)
def update_board(
    board_id: str,
    body: BoardUpdate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = _get_board(db, profile, board_id)
    if body.name is not None:
        board.name = body.name
    if body.grid_columns is not None:
        board.grid_columns = body.grid_columns
    db.commit()
    db.refresh(board)
    return board


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(
    board_id: str,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = _get_board(db, profile, board_id)
    if board.is_root:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "The home board cannot be deleted")
    db.delete(board)
    db.commit()


@router.post("/{board_id}/symbols", response_model=BoardOut, status_code=status.HTTP_201_CREATED)
def add_symbol(
    board_id: str,
    body: BoardSymbolIn,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = _get_board(db, profile, board_id)
    max_pos = max((s.position for s in board.symbols), default=-1)
    db.add(BoardSymbol(
        board_id=board.id,
        position=max_pos + 1,
        symbol_id=body.symbol_id,
        label=body.label,
        word_type=body.word_type,
        image_url=body.image_url,
        is_custom=body.is_custom,
    ))
    db.commit()
    db.refresh(board)
    return board


@router.delete("/{board_id}/symbols/{symbol_id}", response_model=BoardOut)
def remove_symbol(
    board_id: str,
    symbol_id: str,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = _get_board(db, profile, board_id)
    for s in list(board.symbols):
        if s.symbol_id == symbol_id:
            db.delete(s)
    db.commit()
    db.refresh(board)
    return board


@router.put("/{board_id}/symbols", response_model=BoardOut)
def reorder_symbols(
    board_id: str,
    body: ReorderRequest,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    board = _get_board(db, profile, board_id)
    for s in list(board.symbols):
        db.delete(s)
    db.flush()
    for i, sym in enumerate(body.symbols):
        db.add(BoardSymbol(
            board_id=board.id,
            position=i,
            symbol_id=sym.symbol_id,
            label=sym.label,
            word_type=sym.word_type,
            image_url=sym.image_url,
            is_custom=sym.is_custom,
        ))
    db.commit()
    db.refresh(board)
    return board
