import { categories } from '../../js/config/tools.js';

type ToolMeta = (typeof categories)[number]['tools'][number] | null;

export const getToolMeta = (toolId: string): ToolMeta => {
  for (const category of categories) {
    const found = category.tools.find((tool) => tool.id === toolId);
    if (found) return found;
  }
  return null;
};
