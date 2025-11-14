import { Dispatch, SetStateAction } from 'react';

export type AppView = 'grid' | 'tool';

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
type ViewSetter = Dispatch<SetStateAction<AppView>>;
type ToolSetter = Dispatch<SetStateAction<string | null>>;

let loaderState: LoaderOverlayState = { visible: false, text: '' };
let loaderSetter: LoaderSetter | null = null;

let alertState: AlertOverlayState = {
  visible: false,
  title: '',
  message: '',
};
let alertSetter: AlertSetter | null = null;

let appViewState: AppView = 'grid';
let appViewSetter: ViewSetter | null = null;

let reactToolId: string | null = null;
let reactToolSetter: ToolSetter | null = null;

const emitLoaderState = (next: LoaderOverlayState) => {
  loaderState = next;
  if (loaderSetter) {
    loaderSetter(next);
  }
};

const emitAlertState = (next: AlertOverlayState) => {
  alertState = next;
  if (alertSetter) {
    alertSetter(next);
  }
};

const emitViewState = (next: AppView) => {
  appViewState = next;
  if (appViewSetter) {
    appViewSetter(next);
  }
};

const emitReactToolState = (next: string | null) => {
  reactToolId = next;
  if (reactToolSetter) {
    reactToolSetter(next);
  }
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

export const registerViewBridge = (setter: ViewSetter) => {
  appViewSetter = setter;
  setter(appViewState);
};

export const unregisterViewBridge = () => {
  appViewSetter = null;
};

export const setAppView = (view: AppView) => {
  emitViewState(view);
};

export const registerReactToolBridge = (setter: ToolSetter) => {
  reactToolSetter = setter;
  setter(reactToolId);
};

export const unregisterReactToolBridge = () => {
  reactToolSetter = null;
};

export const setActiveReactTool = (toolId: string | null) => {
  emitReactToolState(toolId);
};
