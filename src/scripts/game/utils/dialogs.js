import { login, register } from '../../store/actions/requests';
import { changeMode } from '../../store/actions/actions';
import { MODE } from '../constants';

function create(tag, className, id) {
  const elt = document.createElement(tag);
  if (className) elt.className = className;
  if (id) elt.id = id;
  return elt;
}

function makeInputLine(id) {
  const line = create('div', 'input-line');
  const labelContainer = create('span', 'label-container');
  const label = create('div', 'label');
  label.innerHTML = id.substring(0,8) === 'password' ? 'password' : id;
  const inputContainer = create('span', 'input-container');
  const input = create('input', 'input', id);
  if (id.substring(0,8) === 'password') input.type = 'password';
  labelContainer.append(label);
  inputContainer.append(input);
  line.append(labelContainer, inputContainer);
  return { line, input };
}

function makeButtons() {
  const submit = create('button', 'submit');
  submit.innerHTML = 'OK';
  const cancel = create('button', 'cancel');
  cancel.innerHTML = 'CANCEL';
  const buttons = create('div', 'buttons');
  buttons.append(submit, cancel);
  return { buttons, submit, cancel };
}

export function showLogin(store, dimCallback) {
  const container = document.getElementById('container');
  const loginPopup = create('div', 'overlay', 'login');
  container.append(loginPopup);

  const title = create('div', 'title');
  title.innerHTML = 'LOGIN';
  const username = makeInputLine('username');
  const password = makeInputLine('password');
  const { buttons, submit, cancel } = makeButtons();

  submit.onclick = () => {
    const usernameText = username.input.value.slice(0);
    const passwordText = password.input.value.slice(0);
    store.dispatch(
      login(usernameText, passwordText)
    );
    store.dispatch(
      changeMode(MODE.MAP)
    );
    dimCallback();
    container.removeChild(loginPopup);
  }
  cancel.onclick = () => {
    dimCallback();
    container.removeChild(loginPopup);
  }

  const content = create('div', 'content');
  content.append(title, username.line, password.line, buttons);
  loginPopup.append(content);
}

export function showRegister(store, dimCallback) {
  const container = document.getElementById('container');
  const registerPopup = create('div', 'overlay', 'register');
  container.append(registerPopup);

  const title = create('div', 'title');
  title.innerHTML = 'REGISTER';
  const username = makeInputLine('username');
  const email = makeInputLine('email');
  const password1 = makeInputLine('password1');
  const password2 = makeInputLine('password2');
  const { buttons, submit, cancel } = makeButtons();

  submit.onclick = () => {
    const usernameText = username.input.value.slice(0);
    const emailText = email.input.value.slice(0);
    const passwordText = password1.input.value.slice(0);
    store.dispatch(
      register(usernameText, emailText, passwordText)
    )
    dimCallback();
    container.removeChild(registerPopup);
  }
  cancel.onclick = () => {
    dimCallback();
    container.removeChild(registerPopup);
  }

  const content = create('div', 'content');
  content.append(
    title, username.line, email.line, password1.line, password2.line, buttons
  );
  registerPopup.append(content);
}
