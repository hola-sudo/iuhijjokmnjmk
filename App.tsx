
import React, { useState } from 'react';
import { processLegalText } from './services/geminiService';
import { AppState } from './types';
import { LegalCanvas } from './components/LegalCanvas';
import { DownloadIcon, LegalIcon } from './components/Icons';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    inputText: '',
    isProcessing: false,
    suite: null,
    activeSheetId: null,
    error: null,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerate = async () => {
    if (!state.inputText.trim()) return;
    
    setState(prev => ({ ...prev, isProcessing: true, error: null, suite: null }));
    try {
      const suite = await processLegalText(state.inputText);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        suite, 
        activeSheetId: suite.sheets[0]?.id || null 
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Error arquitectando la suite visual. Intenta con un fragmento más específico del contrato.' 
      }));
    }
  };

  const activeSheet = state.suite?.sheets.find(s => s.id === state.activeSheetId);

  const handleExport = async () => {
    const node = document.getElementById('legal-design-canvas');
    if (!node) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(node, { 
        pixelRatio: 2.5, 
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0' // Export cleaner image
        }
      });
      const link = document.createElement('a');
      link.download = `we-law-explicacion-${activeSheet?.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Error exportando. Intenta capturar la pantalla directamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-indigo-100">
      <nav className="h-24 border-b border-slate-100 bg-white/70 backdrop-blur-2xl flex items-center justify-between px-12 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-serif italic text-4xl shadow-2xl shadow-indigo-100">W</div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tighter text-2xl">WeLaw<span className="text-indigo-600">Architect</span></h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-black">Visual Explanation Studio</p>
          </div>
        </div>
        {state.suite && (
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full text-sm font-black hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><DownloadIcon /> Exportar Lámina Pro</>}
          </button>
        )}
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-[450px] border-r border-slate-100 bg-white flex flex-col h-[calc(100vh-96px)] shadow-2xl shadow-slate-200/20">
          <div className="p-10 flex-1 overflow-y-auto space-y-10">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Input de Contrato (+10 Páginas)</h3>
              <textarea
                className="w-full h-80 p-6 text-sm bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none font-semibold leading-relaxed"
                placeholder="Pega aquí el contenido extenso del contrato o cláusulas complejas..."
                value={state.inputText}
                onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
              />
              <button
                onClick={handleGenerate}
                disabled={state.isProcessing || !state.inputText.trim()}
                className="w-full mt-6 bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-600 shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-3 group"
              >
                {state.isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Procesar Mecánicas</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
            </section>

            {state.suite && (
              <section className="animate-in slide-in-from-left duration-700">
                <div className="flex items-center gap-3 mb-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Suite de Explicación</h3>
                   <div className="h-px flex-1 bg-slate-50"></div>
                </div>
                <div className="space-y-3">
                  {state.suite.sheets.map(sheet => (
                    <button
                      key={sheet.id}
                      onClick={() => setState(prev => ({ ...prev, activeSheetId: sheet.id }))}
                      className={`w-full text-left p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 group ${
                        state.activeSheetId === sheet.id 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-lg' 
                        : 'bg-white border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${state.activeSheetId === sheet.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 group-hover:bg-white'}`}>
                         <LegalIcon name={sheet.type === 'risk-heatmap' ? 'alert' : 'document'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">{sheet.type}</p>
                        <span className="text-sm font-bold truncate block">{sheet.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Canvas Area */}
        <section className="flex-1 bg-slate-50/50 p-16 overflow-y-auto">
          {!state.suite && !state.isProcessing && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
              <div className="w-32 h-32 bg-white rounded-[4rem] shadow-2xl flex items-center justify-center text-slate-100 mb-4 animate-bounce duration-[3s]">
                <LegalIcon name="document" className="w-16 h-16" />
              </div>
              <h3 className="text-5xl font-serif font-bold text-slate-800 italic tracking-tighter leading-tight">Tu contrato merece ser entendido.</h3>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Pega documentos legales complejos para transformarlos en una suite de láminas visuales que expliquen la lógica, los riesgos y las responsabilidades.
              </p>
            </div>
          )}

          {state.isProcessing && (
            <div className="h-full flex flex-col items-center justify-center space-y-10">
               <div className="relative">
                  <div className="w-24 h-24 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-serif italic text-indigo-600 font-black text-2xl">W</div>
               </div>
               <div className="text-center space-y-4">
                  <p className="font-serif italic text-slate-800 text-3xl font-bold animate-pulse">Analizando Mecánicas Legales...</p>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Arquitectando Suite Visual</p>
               </div>
            </div>
          )}

          {activeSheet && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-6xl mx-auto">
              <LegalCanvas sheet={activeSheet} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
