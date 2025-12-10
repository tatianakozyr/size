export interface SizeRow {
  [key: string]: string;
}

export interface ChartCategory {
  id: string;
  name: string;
  data: SizeRow[];
}

export interface UserInput {
  height: string;
  weight: string;
  image: File | null;
}

export interface AnalysisResult {
  estimatedChest: number;
  estimatedWaist: number;
  estimatedHips: number;
  recommendedSize: string;
  reasoning: string;
  confidence: number;
}

export type Language = 'uk' | 'en' | 'ru';

export interface AppTranslations {
  appTitle: string;
  appSubtitle: string;
  selectCategory: string;
  usingTable: string;
  rows: string;
  showTable: string;
  hideTable: string;
  instructionsTitle: string;
  instructionsStep1: string;
  instructionsStep2: string;
  instructionsStep3: string;
  instructionsNote: string;
  errorAnalysis: string;
  
  // Default Charts
  chart_universal: string;
  chart_mens_jackets: string;
  chart_sportswear: string;

  // InputForm
  photoLabel: string;
  dragDrop: string;
  orClick: string;
  fileHint: string;
  heightLabel: string;
  weightLabel: string;
  analyzeBtn: string;
  analyzingBtn: string;
  privacyNote: string;

  // ResultCard
  recTitle: string;
  aiEstimates: string;
  chest: string;
  waist: string;
  hips: string;
  tryAgain: string;

  // Editor
  editorTitle: string;
  yourCategories: string;
  addTable: string;
  categoryNamePlaceholder: string;
  addColumn: string;
  addRow: string;
  save: string;
  cancel: string;
  errorUnique: string;
  errorEmpty: string;
  errorDeleteLast: string;
  newColumn: string;
}