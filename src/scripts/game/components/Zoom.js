import Connect from '../../store/reducers/Connect';
import { drawByName } from '../utils/draw';

export default class Zoom {
  constructor (store, canvas, ctx, loader) {
    this.store = store;
    this.canvas = canvas;
    this.ctx = ctx;
    this.iconsXl = loader.getImage('icons-xl');

    this.connect = new Connect(this.store);
  }

  update(delta, xClick, yClick) {

  }

  render() {
    drawByName(this.ctx, this.iconsXl, 'glass', 2, 960 - 64, 0);
    drawByName(this.ctx, this.iconsXl, 'zoom-out', 2, 960 - 64 * 2, 0);
    drawByName(this.ctx, this.iconsXl, 'zoom-in', 2, 960 - 64 * 3, 0);
  }
}
