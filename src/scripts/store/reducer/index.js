import {
  KEYDOWN, KEYUP, MOUSEDOWN, DRAG, MOUSEUP, CLICKED,
  ZOOM_IN, ZOOM_OUT, CHANGE_MODE, ERROR,
  REGISTER_REQUEST, REGISTER_RESPONSE, LOGIN_REQUEST, LOGIN_RESPONSE,
  LOGOUT_REQUEST, LOGOUT_RESPONSE, TILE_UPDATE, EVENT_REQUEST, EVENT_RESPONSE,
} from '../actions/actions';
import { OPEN, CLOSE, MESSAGE } from 'redux-websocket-bridge';
import {
  keyDown, keyUp, mouseDown, drag, mouseUp, clicked,zoomIn, zoomOut, changeMode
} from './ui';
import {
  request, error, registerResponse, loginResponse, logoutResponse,
  tileUpdate, eventResponse, openSocket, closeSocket
} from './game';
import { initialState } from './initialState';

export default function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case KEYDOWN:
      return keyDown(state, action);
    case KEYUP:
      return keyUp(state, action);
    case MOUSEDOWN:
      return mouseDown(state, action);
    case DRAG:
      return drag(state, action);
    case MOUSEUP:
      return mouseUp(state, action);
    case CLICKED:
      return clicked(state);
    case ZOOM_IN:
      return zoomIn(state);
    case ZOOM_OUT:
      return zoomOut(state);
    case CHANGE_MODE:
      return changeMode(state, action);
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
    case EVENT_REQUEST:
      return request(state);
    case ERROR:
      return error(state, action);
    case REGISTER_RESPONSE:
      return registerResponse(state);
    case LOGIN_RESPONSE:
      return loginResponse(state, action);
    case LOGOUT_RESPONSE:
      return logoutResponse(state);
    case TILE_UPDATE:
      return tileUpdate(state, action);
    case EVENT_RESPONSE:
      return eventResponse(state, action);
    case `@@websocket/${ OPEN }`:
      return openSocket(state);
    case `@@websocket/${ CLOSE }`:
      return closeSocket(state);
    default:
      return state;
  }
}
