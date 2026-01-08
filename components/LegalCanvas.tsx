
import React from 'react';
import { VisualSheet, DiagramNode, DiagramConnection } from '../types';
import { LegalIcon } from './Icons';

const NodeTypeBadge: React.FC<{ type?: string }> = ({ type }) => {
  const styles: Record<string, string> = {
    trigger: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    condition: 'bg-amber-100 text-amber-700 border-amber-200',
    action: 'bg-blue-100 text-blue-700 border-blue-200',
    penalty: 'bg-red-100 text-red-700 border-red-200',
    result: 'bg-green-100 text-green-700 border-green-200',
  };
  return type ? (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border mb-2 inline-block ${styles[type.toLowerCase()] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {type}
    </span>
  ) : null;
};

const ExplainerCard: React.FC<{ node: DiagramNode }> = ({ node }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-3">
      <NodeTypeBadge type={node.type} />
      {node.role && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{node.role}</span>}
    </div>
    <h4 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{node.label}</h4>
    <p className="text-xs text-slate-500 leading-relaxed mb-4">{node.detail}</p>
    {node.tags && (
      <div className="flex flex-wrap gap-1">
        {node.tags.map((tag, i) => (
          <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md uppercase tracking-wider">{tag}</span>
        ))}
      </div>
    )}
  </div>
);

const LogicFlowDiagram: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {data.nodes?.map((node: DiagramNode, idx: number) => (
          <div key={node.id} className="relative">
            <ExplainerCard node={node} />
            {idx < data.nodes.length - 1 && (
              <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {data.connections && (
        <div className="mt-16 p-8 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
          <h5 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Conexiones Lógicas e Interdependencias</h5>
          <div className="space-y-4">
            {data.connections.map((conn: DiagramConnection, idx: number) => (
              <div key={idx} className="flex items-center gap-4 group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{conn.from}</span>
                <div className="flex-1 h-px bg-slate-700 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-slate-800 rounded-full text-[10px] font-bold border border-slate-700 italic">
                    {conn.label}
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">{conn.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HeatmapDiagram: React.FC<{ data: any }> = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
    {data.nodes?.map((node: DiagramNode) => {
      const isHigh = node.impact === 'high';
      return (
        <div key={node.id} className={`p-10 rounded-[4rem] border-2 transition-all ${
          isHigh ? 'bg-red-50/50 border-red-200 shadow-xl shadow-red-100/20' : 
          node.impact === 'medium' ? 'bg-amber-50/50 border-amber-200' : 'bg-green-50/50 border-green-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isHigh ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'
            }`}>
              RIESGO {node.impact}
            </div>
            {isHigh && <div className="animate-ping w-2 h-2 rounded-full bg-red-500"></div>}
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-4">{node.label}</h4>
          <p className="text-slate-600 leading-relaxed italic text-sm mb-6">{node.detail}</p>
          <div className="flex gap-2">
            {node.tags?.map((t, i) => <span key={i} className="text-[9px] font-bold bg-white/60 px-2 py-1 rounded border uppercase">{t}</span>)}
          </div>
        </div>
      );
    })}
  </div>
);

const ResponsibilityMatrix: React.FC<{ data: any }> = ({ data }) => (
  <div className="p-8 space-y-6">
    {data.nodes?.map((node: DiagramNode) => (
      <div key={node.id} className="flex flex-col md:flex-row gap-6 items-center bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:translate-x-2 transition-transform">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-black text-2xl border-2 border-indigo-100">
          {node.role?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{node.role || 'Responsable'}</span>
            <div className="h-px flex-1 bg-slate-50"></div>
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">{node.label}</h4>
          <p className="text-sm text-slate-500 leading-relaxed italic">{node.detail}</p>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
           <span className="text-[9px] font-black text-slate-400 uppercase mb-2">Entregable</span>
           <span className="font-bold text-slate-800 text-xs text-center">{node.value || 'Validación Legal'}</span>
        </div>
      </div>
    ))}
  </div>
);

export const LegalCanvas: React.FC<{ sheet: VisualSheet }> = ({ sheet }) => {
  return (
    <div id="legal-design-canvas" className="bg-white rounded-[5rem] shadow-2xl overflow-hidden border border-slate-50 flex flex-col min-h-[900px]">
      
      {/* Header Premium */}
      <div className="p-16 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white font-serif italic text-4xl shadow-2xl">W</div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-1">Visual Mechanics Sheet</h1>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Protocolo We Law v5.2</p>
            </div>
          </div>
          <div className="px-8 py-3 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200">
            {sheet.type.replace('-', ' ')}
          </div>
        </div>
        
        <h2 className="font-serif text-7xl font-bold text-slate-900 mb-10 tracking-tighter leading-[0.9]">{sheet.title}</h2>
        
        <div className="relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Contexto de la Arquitectura Legal</h4>
          <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
            "{sheet.explanation}"
          </p>
        </div>
      </div>

      {/* Area de Diagramas Especializados */}
      <div className="flex-1 bg-white">
        {sheet.type === 'logic-flow' && <LogicFlowDiagram data={sheet.data} />}
        {sheet.type === 'risk-heatmap' && <HeatmapDiagram data={sheet.data} />}
        {sheet.type === 'responsibility-matrix' && <ResponsibilityMatrix data={sheet.data} />}
        {/* Fallback genérico para otros tipos */}
        {!['logic-flow', 'risk-heatmap', 'responsibility-matrix'].includes(sheet.type) && <LogicFlowDiagram data={sheet.data} />}
      </div>

      {/* Footer Branding */}
      <div className="p-16 border-t border-slate-50 text-center bg-slate-50/20">
        <div className="flex justify-center gap-2 mb-8">
           {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>)}
        </div>
        <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.6em]">We Law Visual Explanation Engine • Pro Version 2025</p>
      </div>
    </div>
  );
};
