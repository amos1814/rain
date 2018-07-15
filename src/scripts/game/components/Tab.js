import Connect from '../../store/reducers/Connect';
import { screenToImageButton } from './utils';
import { drawByName, trace } from '../utils/draw';

export default class Tab {
  constructor (store, canvas, ctx, loader, buttons, height) {
    this.store = store;
    this.canvas = canvas;
    this.ctx = ctx;
    this.iconsXl = loader.getImage('icons-xl');

    this.buttons = buttons;
    this.height = height;
    this.scale = 4;
    this.size = this.iconsXl.tileset.tilewidth * this.scale;

    this.ctx.strokeStyle = '#FFF';
    this.ctx.lineWidth = 2;

    this.fontSize = 16;
    this.lineHeight = 22;
  }

  update(delta, x, y) {
    const clickedButton = x && y && screenToImageButton(x, y, this.buttons);
    // clickedButton && this.store.dispatch(clickedButton.onClick());
    clickedButton && console.log(clickedButton.name);
  }

  render() {
    this.ctx.textAlign = 'center';
    this.ctx.font = this.fontSize + 'px MECC';
    this.buttons = this.buttons.map((button, index) => {
      const x = this.height * index + (this.height - this.size) / 2;
      const y = this.canvas.height - (this.height + this.size + this.lineHeight) / 2;
      drawByName(this.ctx, this.iconsXl, button.name, this.scale, x, y);
      this.ctx.fillText(button.name, x + this.size / 2, y + this.size + this.lineHeight);
      trace(this.ctx, this.size, x, y);
      return Object.assign({}, button, {
        xPos: x,
        yPos: y,
        width: this.size,
        height: this.size + this.lineHeight
      });
    });
    this.ctx.textAlign = 'left';
  }
}
