import React, { useState, useEffect } from 'react';
import { ChartCategory, SizeRow, AppTranslations } from '../types';
import { X, Save, Plus, Trash2, AlertCircle, Table as TableIcon } from 'lucide-react';

interface ChartEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  charts: ChartCategory[];
  onSaveCharts: (newCharts: ChartCategory[]) => void;
  t: AppTranslations;
}

const ChartEditorModal: React.FC<ChartEditorModalProps> = ({ isOpen, onClose, charts, onSaveCharts, t }) => {
  const [localCharts, setLocalCharts] = useState<ChartCategory[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  
  // Grid State
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCharts(JSON.parse(JSON.stringify(charts)));
      const initialId = charts[0]?.id || '';
      if (initialId) {
        // Initialize grid with first chart
        const chart = charts[0];
        initGrid(chart);
        setSelectedChartId(chart.id);
      }
    }
  }, [isOpen, charts]);

  const getChartName = (chart: ChartCategory) => {
    if (chart.id === 'universal') return t.chart_universal;
    if (chart.id === 'mens_jackets') return t.chart_mens_jackets;
    if (chart.id === 'sportswear') return t.chart_sportswear;
    return chart.name;
  };

  const initGrid = (chart: ChartCategory) => {
      setEditName(getChartName(chart));
      if (chart.data && chart.data.length > 0) {
        const h = Object.keys(chart.data[0]);
        const r = chart.data.map(row => h.map(k => row[k] || ''));
        setHeaders(h);
        setRows(r);
      } else {
        setHeaders(['Розмір', 'Параметри']);
        setRows([['', '']]);
      }
      setError(null);
  };

  const saveCurrentToLocalCharts = () => {
    // Convert grid back to SizeRow[]
    const newData: SizeRow = rows.map(row => {
        const obj: SizeRow = {};
        headers.forEach((h, i) => {
            if (h.trim()) obj[h.trim()] = row[i] || '';
        });
        return obj;
    });

    const updated = localCharts.map(c => 
        c.id === selectedChartId ? { ...c, name: editName, data: newData } : c
    );
    setLocalCharts(updated);
    return updated;
  };

  const handleSelectChart = (id: string) => {
    if (id === selectedChartId) return;
    
    // Save previous
    const updatedCharts = saveCurrentToLocalCharts();
    
    // Switch
    const nextChart = updatedCharts.find(c => c.id === id);
    if (nextChart) {
        setSelectedChartId(id);
        initGrid(nextChart);
    }
  };

  const handleAddNewCategory = () => {
    const updatedCharts = saveCurrentToLocalCharts();
    const newId = `custom_${Date.now()}`;
    const newChart: ChartCategory = {
        id: newId,
        name: 'Нова категорія',
        data: [{ 'Розмір': 'M', 'Зріст': '175', 'Груди': '100' }]
    };
    
    const newList = [...updatedCharts, newChart];
    setLocalCharts(newList);
    setSelectedChartId(newId);
    initGrid(newChart);
  };

  const handleDeleteCategory = (id: string) => {
    if (localCharts.length <= 1) {
        setError(t.errorDeleteLast);
        return;
    }
    
    const filtered = localCharts.filter(c => c.id !== id);
    setLocalCharts(filtered);
    
    if (id === selectedChartId) {
        const next = filtered[0];
        setSelectedChartId(next.id);
        initGrid(next);
    }
  };

  const handleSaveAll = () => {
    // Validate duplicates in headers
    const uniqueHeaders = new Set(headers.map(h => h.trim()));
    if (uniqueHeaders.size !== headers.length) {
        setError(t.errorUnique);
        return;
    }
    if (headers.some(h => !h.trim())) {
        setError(t.errorEmpty);
        return;
    }

    const updatedCharts = saveCurrentToLocalCharts();
    onSaveCharts(updatedCharts);
    onClose();
  };

  // Grid Operations
  const updateHeader = (idx: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[idx] = val;
    setHeaders(newHeaders);
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const newRows = [...rows];
    newRows[rowIdx] = [...newRows[rowIdx]];
    newRows[rowIdx][colIdx] = val;
    setRows(newRows);
  };

  const addColumn = () => {
    setHeaders([...headers, t.newColumn]);
    setRows(rows.map(r => [...r, '']));
  };

  const removeColumn = (idx: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== idx));
    setRows(rows.map(r => r.filter((_, i) => i !== idx)));
  };

  const addRow = () => {
    setRows([...rows, new Array(headers.length).fill('')]);
  };

  const removeRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-[95vw] h-[90vh] flex flex-col overflow-hidden border border-white ring-1 ring-violet-500/10">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-violet-100 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white z-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
                <TableIcon className="w-7 h-7 text-violet-100" />
                {t.editorTitle}
            </h2>
            <div className="flex items-center gap-4">
                {error && (
                    <div className="flex items-center gap-2 text-white text-sm bg-red-500/20 px-3 py-1.5 rounded-full border border-red-200/50 animate-pulse font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 bg-violet-50/50 border-r border-violet-100 flex flex-col flex-shrink-0 backdrop-blur-sm">
                <div className="p-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 px-2">{t.yourCategories}</p>
                    {localCharts.map(chart => (
                        <div 
                            key={chart.id}
                            onClick={() => handleSelectChart(chart.id)}
                            className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                                selectedChartId === chart.id 
                                ? 'bg-white border-violet-200 shadow-md shadow-violet-100' 
                                : 'border-transparent hover:bg-white/60 hover:border-violet-100'
                            }`}
                        >
                            <span className={`text-sm font-bold truncate ${selectedChartId === chart.id ? 'text-violet-700' : 'text-slate-600'}`}>
                                {chart.id === selectedChartId ? editName || getChartName(chart) : getChartName(chart)}
                            </span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(chart.id); }}
                                className={`opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-lg transition-all ${localCharts.length === 1 ? 'hidden' : ''}`}
                                title="Видалити"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-violet-100 bg-white/50">
                    <button 
                        onClick={handleAddNewCategory}
                        className="w-full py-3 px-4 bg-white border border-dashed border-violet-300 rounded-xl text-violet-600 text-sm font-bold hover:border-violet-500 hover:bg-violet-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> {t.addTable}
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                
                {/* Editor Toolbar */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-6 bg-white/50 backdrop-blur-sm z-10">
                    <div className="flex-1 max-w-md">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t.categoryNamePlaceholder}</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 font-bold transition-all text-lg"
                            placeholder={t.categoryNamePlaceholder}
                        />
                    </div>
                    <div className="h-10 w-px bg-slate-200 mx-2"></div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={addColumn}
                            className="px-4 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-bold hover:bg-violet-100 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> {t.addColumn}
                        </button>
                    </div>
                </div>

                {/* Spreadsheet Grid */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
                    <div className="inline-block min-w-full align-middle border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-violet-50/50">
                                <tr>
                                    <th scope="col" className="w-12 px-3 py-3 text-center text-xs font-medium text-slate-400 sticky left-0 bg-violet-50 border-r border-slate-200 z-10">
                                        #
                                    </th>
                                    {headers.map((header, idx) => (
                                        <th key={idx} scope="col" className="px-1 py-1 min-w-[150px] relative group border-r border-violet-100 last:border-none">
                                            <input 
                                                type="text"
                                                value={header}
                                                onChange={(e) => updateHeader(idx, e.target.value)}
                                                className="w-full bg-transparent px-3 py-2 text-left text-xs font-bold text-violet-900 uppercase tracking-wider focus:outline-none focus:bg-white rounded-sm"
                                            />
                                            <button 
                                                onClick={() => removeColumn(idx)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Видалити стовпець"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {rows.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="hover:bg-violet-50/30 transition-colors group">
                                        <td className="px-3 py-3 text-center sticky left-0 bg-white group-hover:bg-violet-50 border-r border-slate-100 z-10">
                                            <button 
                                                onClick={() => removeRow(rowIdx)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                title="Видалити рядок"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                        {row.map((cell, colIdx) => (
                                            <td key={colIdx} className="p-0 border-r border-slate-100 last:border-none relative">
                                                <input 
                                                    type="text"
                                                    value={cell}
                                                    onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                                                    className="w-full h-full px-4 py-3 text-sm font-medium text-slate-700 bg-transparent focus:bg-violet-50 focus:ring-2 focus:ring-inset focus:ring-violet-500/20 focus:outline-none focus:z-10 relative transition-all"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <button 
                        onClick={addRow}
                        className="mt-4 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/20 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> {t.addRow}
                    </button>
                    
                    {/* Spacer for scrolling */}
                    <div className="h-20"></div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-5 border-t border-slate-200 bg-white flex justify-end gap-3 z-20 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
                    >
                        {t.cancel}
                    </button>
                    <button 
                        onClick={handleSaveAll}
                        className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-lg hover:shadow-violet-200 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <Save className="w-4 h-4" />
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChartEditorModal;