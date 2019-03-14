import Connect from '../Connect';
import Animation from '../utils/Animation';
import { clickedLeft } from '../actions/actions';
import { sendEvent } from '../actions/requests';
import { EVENTS } from '../actions/types';
import { LAYER } from '../utils/constants';
import { screenToImageButton, findTile } from './utils';
import {
  drawById, drawHover, fillInverseCircle
} from '../utils/draw';
import { MEDIUM_OPAQUE } from '../utils/colors';

const { BOTTOM, MIDDLE } = LAYER;

export default class Camera {
  constructor(store, canvas, ctx, loader) {
    this.store = store;
    this.canvas = canvas;
    this.ctx = ctx;
    this.atlas = loader.getImage('atlas');
    this.icons = loader.getImage('icons');
    this.blink = new Animation(1, 1, 0.5);
    this.fontSize = 16;

    this.connect = new Connect(this.store);
  }

  getOffsetOrigin(size, xPos, yPos, xCoords, yCoords) {
    // move camera
    return {
      x: Math.round((xPos + xCoords / 32) * size - Math.floor(this.canvas.width / 2)),
      y: Math.round((yPos + yCoords / 32) * size - Math.floor(this.canvas.height / 2))
    };
    // clamp values
    // this.x = Math.max(0, Math.min(this.x, this.maxX));
    // this.y = Math.max(0, Math.min(this.y, this.maxY));
  }

  update() {
    const { x, y } = this.connect.clickLeft;
    const tile = x && y && screenToImageButton(x, y, this.clickTiles);
    if (tile) {
      const { zoom } = this.connect.map;
      const xCoord = Math.floor((x - tile.xPos) / zoom);
      const yCoord = Math.floor((y - tile.yPos) / zoom);
      this.store.dispatch(clickedLeft());
      this.store.dispatch(
        sendEvent(EVENTS.MOVE, { id: tile.id, x: xCoord, y: yCoord })
      );
    }
  }

  render(delta) {
    this.blink.tick(delta);
    const {
      pos, coords, positionTarget, coordsTarget, tiles, sight, zoom
    } = this.connect.map;
    const tileSize = this.atlas.tileset.tilewidth * zoom;
    const iconSize = this.icons.tileset.tilewidth * zoom;

    const origin = this.getOffsetOrigin(tileSize, pos.x, pos.y, coords.x, coords.y);
    const startCol = Math.floor(origin.x / tileSize);
    const endCol = startCol + Math.ceil((this.canvas.width / tileSize) + 1);
    const startRow = Math.floor(origin.y / tileSize);
    const endRow = startRow + Math.ceil((this.canvas.height / tileSize) + 1);

    const clickTiles = [];
    let visiblePlayers = [];
    let dim = false;
    for (let col = startCol; col <= endCol; col += 1) {
      for (let row = startRow; row <= endRow; row += 1) {
        const x = col * tileSize - origin.x;
        const y = row * tileSize - origin.y;
        const tile = findTile(tiles, col, row);
        if (tile && Math.abs(pos.x - col) + Math.abs(pos.y - row) <= 1) {
          clickTiles.push(Object.assign({}, tile, {
            xPos: x, yPos: y, width: tileSize, height: tileSize
          }));
        }
        if (tile && Math.abs(pos.x - col) + Math.abs(pos.y - row) <= sight) {
          dim = false;
        } else {
          dim = true;
        }
        if (tile) {
          [BOTTOM, MIDDLE].forEach((layer) => {
            if (layer in tile.layers) {
              const id = tile.layers[layer] - 1;
              drawById(this.ctx, this.atlas, id, zoom, x, y);
            }
          });

          if (positionTarget === tile.id) {
            drawById(
              this.ctx,
              this.icons,
              28 + this.blink.getValue(),
              zoom,
              x + coordsTarget.x * zoom - iconSize / 2,
              y + coordsTarget.y * zoom - iconSize / 2
            );
          }

          if (!dim && tile.visitors && tile.visitors.length > 0) {
            visiblePlayers = visiblePlayers.concat(
              tile.visitors.map((visitor) => {
                drawById(
                  this.ctx,
                  this.icons,
                  26 + this.blink.getValue(),
                  zoom,
                  x + visitor.xCoord * zoom - iconSize / 2,
                  y + visitor.yCoord * zoom - iconSize / 2
                );
                return ({
                  name: visitor.name,
                  xPos: x + visitor.xCoord * zoom - iconSize / 2,
                  yPos: y + visitor.yCoord * zoom - iconSize / 2,
                  width: iconSize,
                  height: iconSize
                });
              })
            );
          }

          if (dim) {
            this.ctx.fillStyle = MEDIUM_OPAQUE;
            this.ctx.fillRect(x, y, tileSize, tileSize);
          }
        }
      }
    }
    this.clickTiles = clickTiles;

    const { mousePos } = this.connect;
    if (mousePos.x && mousePos.y) {
      const button = screenToImageButton(mousePos.x, mousePos.y, visiblePlayers);
      if (button) drawHover(this.ctx, this.fontSize, button);
    }

    drawById(
      this.ctx,
      this.icons,
      24 + this.blink.getValue(),
      zoom,
      (this.canvas.width - iconSize) / 2,
      (this.canvas.height - iconSize) / 2
    );

    fillInverseCircle(this.ctx, this.canvas, tileSize * sight);
  }
}