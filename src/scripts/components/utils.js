export const checkImageCollision = (x, y, button) => {
  if (
    x >= button.xPos && x < (button.xPos + button.width)
    && y >= button.yPos && y < (button.yPos + button.height)
  ) {
    return true;
  }
  return false;
};

export const checkTextCollision = (x, y, button) => {
  if (
    x >= button.xPos && x < (button.xPos + button.width)
    && y <= button.yPos && y > (button.yPos - button.height)
  ) {
    return true;
  }
  return false;
};

export const screenToTextButton = (x, y, list) => (
  list.find(button => checkTextCollision(x, y, button))
);

export const screenToTextButtonId = (x, y, list) => {
  const selectedButton = screenToTextButton(x, y, list);
  return selectedButton ? selectedButton.id : null;
};

export const screenToImageButton = (x, y, list) => (
  list.find(button => checkImageCollision(x, y, button))
);

export const screenToImageButtonId = (x, y, list) => {
  const selectedButton = screenToImageButton(x, y, list);
  return selectedButton ? selectedButton.id : null;
};

export const getItemById = (array, id) => array.find(x => x.id === id);

// todo get rid of this
export const findTile_DEPRECATED = (tiles, x, y) => (
  tiles.find(tile => x === tile.x && y === tile.y)
);

export const colRowToCoords = (col, row) => ({
  xPos: Math.floor(col / 64),
  yPos: Math.floor(row / 64),
  xCoord: col % 64,
  yCoord: row % 64,
});

export const coordsToColRow = (xPos, yPos, xCoord, yCoord) => ({
  col: xPos * 64 + xCoord,
  row: yPos * 64 + yCoord,
});

// export const findGroundTile = (tiles, xPos, yPos, xCoord, yCoord) => {
//   const superTile = tiles.find(tile => tile.xPos === xPos && tile.yPos === yPos);
//   if (superTile) {
//     return superTile.ground.find(tile => tile.xCoord === xCoord && tile.yCoord === yCoord);
//   }
//   return undefined;
// };

// export const findTreeTile = (tiles, xPos, yPos, xCoord, yCoord) => {
//   const superTile = tiles.find(tile => tile.xPos === xPos && tile.yPos === yPos);
//   if (superTile) {
//     return superTile.trees.find(tile => tile.xCoord === xCoord && tile.yCoord === yCoord);
//   }
//   return undefined;
// };

export const findTile = (tiles, xPos, yPos, xCoord, yCoord) => {
  if (!tiles[xPos]) return;
  if (!tiles[xPos][yPos]) return;
  if (!tiles[xPos][yPos][xCoord]) return;
  if (!tiles[xPos][yPos][xCoord][yCoord]) return;
  return tiles[xPos][yPos][xCoord][yCoord];
};

export const matchTile = (tile, entity) => (
  tile && entity
  && tile.xPos === entity.xPos
  && tile.yPos === entity.yPos
  && tile.xCoord === entity.xCoord
  && tile.yCoord === entity.yCoord
);

export const getRandomInt = max => (
  Math.floor(Math.random() * Math.floor(max))
);
