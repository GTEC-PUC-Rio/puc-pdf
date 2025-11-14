import type { ComponentType } from 'react';
import { MergeTool } from '../components/tools/MergeTool.tsx';
import { SplitTool } from '../components/tools/SplitTool.tsx';
import { OrganizeTool } from '../components/tools/OrganizeTool.tsx';
import { RotateTool } from '../components/tools/RotateTool.tsx';
import { DeletePagesTool } from '../components/tools/DeletePagesTool.tsx';

type ToolComponent = ComponentType;

const registry: Record<string, ToolComponent> = {
  merge: MergeTool,
  split: SplitTool,
  organize: OrganizeTool,
  rotate: RotateTool,
  'delete-pages': DeletePagesTool,
};

export const isReactTool = (toolId: string) => Boolean(registry[toolId]);

export const getReactToolComponent = (toolId: string) =>
  registry[toolId] ?? null;
