import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import SizeTable from './components/SizeTable';
import ChartEditorModal from './components/ChartEditorModal';
import { analyzeSize } from './services/geminiService';
import { UserInput, AnalysisResult, ChartCategory, Language } from './types';
import { APP_STEPS, DEFAULT_CHARTS } from './constants';
import { TRANSLATIONS } from './locales';
import { Shirt, Settings, Table as TableIcon, ChevronDown, Globe } from 'lucide-react';

function App() {
  const [step, setStep] = useState<typeof APP_STEPS[keyof typeof APP_STEPS]>(APP_STEPS.INPUT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('uk');
  
  // Multi-Chart State
  const [charts, setCharts] = useState<ChartCategory[]>(DEFAULT_CHARTS);
  const [activeChartId, setActiveChartId] = useState<string>(DEFAULT_CHARTS[0].id);
  
  // UI State
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Derived state
  const activeChart = useMemo(() => 
    charts.find(c => c.id === activeChartId) || charts[0], 
  [charts, activeChartId]);

  const t = TRANSLATIONS[language];

  // Helper to get translated name for default charts
  const getChartName = (chart: ChartCategory) => {
    if (chart.id === 'universal') return t.chart_universal;
    if (chart.id === 'mens_jackets') return t.chart_mens_jackets;
    if (chart.id === 'sportswear') return t.chart_sportswear;
    return chart.name;
  };

  const handleFormSubmit = async (data: UserInput) => {
    setStep(APP_STEPS.ANALYZING);
    setError(null);
    
    try {
      // Pass the specific active chart data to the AI along with selected language
      const analysis = await analyzeSize(data, activeChart.data, language);
      setResult(analysis);
      setStep(APP_STEPS.RESULT);
    } catch (err) {
      console.error(err);
      setError(t.errorAnalysis);
      setStep(APP_STEPS.INPUT);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(APP_STEPS.INPUT);
    setError(null);
  };

  const handleSaveCharts = (newCharts: ChartCategory[]) => {
    setCharts(newCharts);
    // Ensure active ID is still valid, else default to first
    if (!newCharts.find(c => c.id === activeChartId)) {
        setActiveChartId(newCharts[0]?.id || '');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
            <div className="relative group">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-white/50 cursor-pointer hover:border-violet-300 transition-all text-violet-700">
                    <Globe className="w-4 h-4" />
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="appearance-none bg-transparent text-sm font-bold focus:outline-none cursor-pointer pr-1"
                    >
                        <option value="uk">UA</option>
                        <option value="en">EN</option>
                        <option value="ru">RU</option>
                    </select>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                </div>
            </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 pt-6">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-3xl shadow-lg shadow-violet-300/50 mb-6 text-white transform hover:scale-110 transition-transform duration-300">
            <Shirt className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 drop-shadow-sm">
            {t.appTitle}
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-lg leading-relaxed font-medium">
            {t.appSubtitle}
          </p>
        </div>

        {/* Category Selector (Important for UX) */}
        <div className="max-w-xl mx-auto mb-10 relative z-10">
            <label className="block text-xs font-bold text-violet-600 mb-2 text-center uppercase tracking-widest">{t.selectCategory}</label>
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <select 
                    value={activeChartId}
                    onChange={(e) => setActiveChartId(e.target.value)}
                    className="relative appearance-none w-full bg-white border border-violet-100 text-slate-800 text-xl font-bold py-4 pl-6 pr-10 rounded-2xl shadow-xl shadow-violet-100/50 hover:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all cursor-pointer"
                >
                    {charts.map(chart => (
                        <option key={chart.id} value={chart.id}>
                            {getChartName(chart)}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-violet-500">
                    <ChevronDown className="w-6 h-6" />
                </div>
            </div>
            {activeChart && (
                <div className="flex justify-center mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-violet-600 border border-white shadow-sm backdrop-blur-sm">
                        {t.usingTable}: <span className="font-bold ml-1">{getChartName(activeChart)}</span>
                        <span className="mx-2 opacity-30">|</span>
                        {activeChart.data.length} {t.rows}
                    </span>
                </div>
            )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interaction Area (Form or Result) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
            {error && (
                <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {error}
                </div>
            )}

            {step === APP_STEPS.INPUT || step === APP_STEPS.ANALYZING ? (
              <InputForm onSubmit={handleFormSubmit} isLoading={step === APP_STEPS.ANALYZING} t={t} />
            ) : (
              result && <ResultCard result={result} onReset={handleReset} t={t} />
            )}
          </div>

          {/* Right Column: Settings & Reference */}
          <div className="lg:col-span-5 w-full space-y-4">
            
            {/* Table Settings Controls */}
            <div className="flex gap-3">
                <button 
                    onClick={() => setIsChartOpen(!isChartOpen)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-sm group border
                        ${isChartOpen 
                            ? 'bg-violet-600 text-white border-violet-600 shadow-violet-200' 
                            : 'bg-white text-slate-600 border-white/60 hover:border-violet-300 hover:text-violet-600 hover:bg-white'}
                    `}
                >
                    <TableIcon className={`w-4 h-4 ${isChartOpen ? 'text-white' : 'text-slate-400 group-hover:text-violet-600'} transition-colors`} />
                    {isChartOpen ? t.hideTable : t.showTable}
                </button>
                <button 
                    onClick={() => setIsEditorOpen(true)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-white/60 rounded-xl text-sm font-bold text-slate-600 hover:bg-white hover:text-violet-600 hover:border-violet-300 transition-all shadow-sm hover:shadow-md"
                    title={t.editorTitle}
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* Reference Table (Collapsible) */}
            {isChartOpen && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-violet-100/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100 flex justify-between items-center">
                        <h3 className="font-bold text-violet-800 text-sm">
                            {getChartName(activeChart)}
                        </h3>
                    </div>
                    <div className="max-h-[500px] overflow-auto custom-scrollbar">
                        <SizeTable data={activeChart.data} highlightSize={result?.recommendedSize} />
                    </div>
                </div>
            )}
            
            {!isChartOpen && (
                <div className="p-6 bg-white/60 backdrop-blur-md border border-white rounded-2xl shadow-lg shadow-purple-500/5 text-slate-600 text-sm leading-relaxed">
                    <h3 className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs">i</span>
                        {t.instructionsTitle}
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0"></span>
                            <span>{t.instructionsStep1}</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mt-2 flex-shrink-0"></span>
                            <span>{t.instructionsStep2}</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                            <span>{t.instructionsStep3}</span>
                        </li>
                    </ul>
                    <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center gap-2 text-xs text-slate-400 font-medium">
                         <Settings className="w-3.5 h-3.5 text-slate-300" />
                         <span>{t.instructionsNote}</span>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Modal Editor */}
        <ChartEditorModal 
            isOpen={isEditorOpen} 
            onClose={() => setIsEditorOpen(false)} 
            charts={charts}
            onSaveCharts={handleSaveCharts}
            t={t}
        />

      </div>
    </div>
  );
}

export default App;