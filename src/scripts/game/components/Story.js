import { MODE } from '../constants';
import { clicked, changeMode, closeStory } from '../../store/actions/actions';
import { sendEvent } from '../../store/actions/requests';
import Connect from '../../store/Connect';
import { screenToTextButton, getItemById } from './utils';
import { mainText, itemChangeText, partyChangeText, buttonText, splitIntoLines } from '../utils/draw';
import Animation from '../utils/Animation';
import { PALE_GREEN, MEDIUM_RED } from '../colors';

export default class Story {
  constructor (store, canvas, ctx) {
    this.store = store;
    this.canvas = canvas;
    this.ctx = ctx;

    this.blink = new Animation(1, 1, 1);
    this.connect = new Connect(this.store);

    this.fontSize = 16;
    this.lineHeight = this.fontSize * 11 / 8;
    this.ctx.font = this.fontSize + 'px MECC';
    this.selected = null;

    this.width = this.canvas.width / 2;
    this.height = this.canvas.height / 2;

    this.stories = [];

    this.mainText = mainText.bind(null, this.canvas, this.ctx, this.fontSize, this.lineHeight);
    this.itemChangeText = itemChangeText.bind(null, this.canvas, this.ctx, this.fontSize, this.lineHeight);
    this.partyChangeText = partyChangeText.bind(null, this.canvas, this.ctx, this.fontSize, this.lineHeight);
    this.buttonText = buttonText.bind(null, this.canvas, this.ctx, this.fontSize, this.lineHeight);
  }

  select(button) {
    this.store.dispatch(closeStory());
    if (button.text[0] !== 'OK') {
      this.store.dispatch(sendEvent('decision', button.id));
    }
  }

  updateKeys(keys, story) {
    keys.map(key => {
      if (key >= "1" && key <= story.buttons.length.toString()) this.selected = story.buttons[parseInt(key) - 1];
      if (["Escape", "Backspace", "Delete"].includes(key)) this.selected = null;
      if (key === "Enter" && this.selected !== null) {
        this.select(this.selected);
        this.selected = null;
      }
    });
  }

  updateClick(x, y, story) {
    if (x && y) {
      const button = screenToTextButton(x, y, story.buttons);
      if (button) {
        if (this.selected && this.selected.id === button.id) {
          this.select(this.selected);
          this.selected = null;
        } else if (story.buttons.length === 1) {
          this.select(button);
          this.selected = null;
        } else {
          this.selected = button;
        }
      } else {
        this.selected = null;
      }
    }
  }

  update(keys, x, y) {
    this.width = this.canvas.width / 2;
    this.height = this.canvas.height / 2;
    if (this.stories.length > 0) {
      const story = this.stories[this.stories.length - 1];
      this.updateKeys(keys, story);
      this.updateClick(x, y, story);
    }
  }

  renderStoryText(story) {
    this.ctx.font = this.fontSize + 'px MECC';
    this.ctx.fillStyle = PALE_GREEN;

    const maxMainWidth = this.width - this.fontSize * 2;
    const maxButtonWidth = this.width - this.fontSize * 4;
    const text = splitIntoLines(this.ctx, story.text, maxMainWidth);
    const inventoryChanges = story.inventoryChanges;
    const partyChanges = story.partyChanges;
    let buttons = story && story.buttons.map((button, idx) => {
      return Object.assign({}, button, {
        text: splitIntoLines(this.ctx, button.text, maxButtonWidth),
        oneIndex: idx + 1
      });
    });
    const promptText = `What is your choice? ${this.selected && this.selected.oneIndex || ''}`;
    const cursor = this.blink.getValue() ? '' : '_';
    const prompt = splitIntoLines(this.ctx, promptText + cursor, maxMainWidth);

    let xPos = this.width / 2 + this.fontSize;
    let yPos = this.height / 2 + this.fontSize * 2;
    let coords = this.mainText(text, xPos, yPos);

    if (inventoryChanges.length > 0) {
      yPos = coords.yPos + this.lineHeight * 2;
      coords = this.itemChangeText(inventoryChanges, xPos, yPos);
    }

    if (partyChanges.length > 0) {
      yPos = coords.yPos + this.lineHeight * 2;
      coords = this.partyChangeText(partyChanges, xPos, yPos);
    }

    yPos = coords.yPos + this.lineHeight * 2;
    buttons = this.buttonText(buttons, xPos, yPos, this.selected);

    if (buttons.length > 1) {
      this.ctx.fillStyle = PALE_GREEN;
      yPos = buttons[buttons.length - 1].yPos + this.lineHeight * 2;
      this.mainText(prompt, xPos, yPos);
    }

    return buttons
  }

  render(delta) {
    this.blink.tick(delta);
    let buttons;
    this.stories = this.connect.stories;
    if (this.stories.length > 0) {
      this.stories = this.stories.map(story => {
        this.ctx.fillStyle = MEDIUM_RED;
        this.ctx.fillRect(this.width / 2, this.height / 2, this.width, this.height);
        buttons = this.renderStoryText(story);
        return Object.assign({}, story, {
          buttons: buttons
        });
      });
    } else {
      this.stories = [];
    }
  };
}
