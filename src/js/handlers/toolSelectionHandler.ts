import { state } from '../state.js';
import { switchView, toolTemplates } from '../ui.js';
import { setupFileInputHandler } from './fileHandler.js';
import { toolLogic } from '../logic/index.js';
import { createIcons, icons } from 'lucide';
import { isReactTool } from '../../react/bridge/reactToolRegistry.ts';
import { setActiveReactTool } from '../../react/bridge/uiBridge.ts';

const SETUP_AFTER_UPLOAD = ['sign-pdf'];

const initializeToolBehavior = (toolId: string) => {
  const fileInput = document.getElementById('file-input');
  const processBtn = document.getElementById('process-btn');

  if (!fileInput && processBtn) {
    const logic = toolLogic[toolId];
    if (logic) {
      const func = typeof logic.process === 'function' ? logic.process : logic;
      processBtn.onclick = func;
    }
  }

  if (toolLogic[toolId] && typeof toolLogic[toolId].setup === 'function') {
    if (!SETUP_AFTER_UPLOAD.includes(toolId)) {
      toolLogic[toolId].setup();
    }
  }

  if (fileInput) {
    setupFileInputHandler(toolId);
  }
};

export function setupToolInterface(toolId: any) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant' as ScrollBehavior,
  });

  state.activeTool = toolId;
  const useReactTool = isReactTool(toolId);
  const toolContent = document.getElementById('tool-content');
  if (!toolContent) {
    console.warn('Tool content container not found.');
    return;
  }

  if (useReactTool) {
    toolContent.innerHTML = '';
    setActiveReactTool(toolId);
  } else {
    const template = toolTemplates[toolId];
    if (typeof template === 'function') {
      toolContent.innerHTML = template();
    } else {
      console.warn(`Template não encontrado para a ferramenta ${toolId}`);
      toolContent.innerHTML = '';
    }
    setActiveReactTool(null);
  }

  createIcons({ icons });

  if (!useReactTool) {
    initializeToolBehavior(toolId);
  }

  switchView('tool');
}
