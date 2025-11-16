import { Dispatch, SetStateAction } from 'react';

export interface LoaderOverlayState {
  visible: boolean;
  text: string;
}

export interface AlertOverlayState {
  visible: boolean;
  title: string;
  message: string;
}

type LoaderSetter = Dispatch<SetStateAction<LoaderOverlayState>>;
type AlertSetter = Dispatch<SetStateAction<AlertOverlayState>>;

let loaderState: LoaderOverlayState = { visible: false, text: '' };
let loaderSetter: LoaderSetter | null = null;

let alertState: AlertOverlayState = {
  visible: false,
  title: '',
  message: '',
};
let alertSetter: AlertSetter | null = null;

const emitLoaderState = (next: LoaderOverlayState) => {
  loaderState = next;
  loaderSetter?.(next);
};

const emitAlertState = (next: AlertOverlayState) => {
  alertState = next;
  alertSetter?.(next);
};

export const registerLoaderBridge = (setter: LoaderSetter) => {
  loaderSetter = setter;
  setter(loaderState);
};

export const unregisterLoaderBridge = () => {
  loaderSetter = null;
};

export const showLoaderOverlay = (text: string) => {
  emitLoaderState({ visible: true, text });
};

export const hideLoaderOverlay = () => {
  emitLoaderState({ ...loaderState, visible: false });
};

export const registerAlertBridge = (setter: AlertSetter) => {
  alertSetter = setter;
  setter(alertState);
};

export const unregisterAlertBridge = () => {
  alertSetter = null;
};

export const showAlertOverlay = (title: string, message: string) => {
  emitAlertState({ visible: true, title, message });
};

export const hideAlertOverlay = () => {
  emitAlertState({ ...alertState, visible: false });
};
