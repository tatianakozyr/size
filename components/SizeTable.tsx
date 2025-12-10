import React from 'react';
import { SizeRow } from '../types';

interface SizeTableProps {
  data: SizeRow[];
  highlightSize?: string;
}

const SizeTable: React.FC<SizeTableProps> = ({ data, highlightSize }) => {
  if (!data || data.length === 0) return null;

  // Derive headers from the first row keys
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-violet-700 uppercase bg-violet-50/50">
          <tr>
            {headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-3 font-bold whitespace-nowrap">
                    {header}
                </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-100">
          {data.map((row, index) => {
            // Very basic heuristic: check if any value in the row matches the recommended size string
            const isHighlighted = highlightSize && Object.values(row).some(val => 
                val.toString().toLowerCase() === highlightSize.toLowerCase() || 
                highlightSize.toLowerCase().includes(val.toString().toLowerCase())
            );
            
            return (
              <tr 
                key={index} 
                className={`transition-colors duration-300 ${
                    isHighlighted 
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md transform scale-[1.01] rounded-lg' 
                        : 'hover:bg-violet-50/50'
                }`}
              >
                {headers.map((header, cellIdx) => (
                    <td key={`${index}-${header}`} className={`px-4 py-3 whitespace-nowrap font-medium ${isHighlighted ? 'text-white' : ''}`}>
                        {row[header]}
                    </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SizeTable;