
export type DiagramType = 'logic-flow' | 'responsibility-matrix' | 'financial-mechanics' | 'risk-heatmap' | 'timeline';

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
  type?: 'trigger' | 'action' | 'condition' | 'result' | 'penalty';
  role?: string;
  impact?: 'low' | 'medium' | 'high';
  value?: string;
  tags?: string[];
}

export interface DiagramConnection {
  from: string;
  to: string;
  label: string;
  isPositive?: boolean;
}

export interface VisualSheet {
  id: string;
  title: string;
  type: DiagramType;
  explanation: string;
  data: {
    nodes: DiagramNode[];
    connections?: DiagramConnection[];
  };
}

export interface LegalDesignSuite {
  projectName: string;
  sheets: VisualSheet[];
}

export interface AppState {
  inputText: string;
  isProcessing: boolean;
  suite: LegalDesignSuite | null;
  activeSheetId: string | null;
  error: string | null;
}
