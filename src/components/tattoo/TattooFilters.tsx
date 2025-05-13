import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import Select from 'react-select';

interface TattooFiltersProps {
  onStyleChange: (style: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  selectedStyle: string;
  selectedPriceRange: [number, number];
  selectedStatus: string;
  searchTerm: string;
}

const STYLES = [
  { value: '', label: 'Todos os estilos' },
  { value: 'geometric', label: 'Geométrico' },
  { value: 'mandala', label: 'Mandala' },
  { value: 'watercolor', label: 'Aquarela' },
  { value: 'blackwork', label: 'Blackwork' },
  { value: 'traditional', label: 'Tradicional' },
  { value: 'tribal', label: 'Tribal' },
  { value: 'japanese', label: 'Japonês' },
  { value: 'minimalist', label: 'Minimalista' },
  { value: 'dotwork', label: 'Pontilhismo' },
  { value: 'others', label: 'Outros' }
];

const PRICE_RANGES = [
  { value: [0, 99999], label: 'Todas as faixas' },
  { value: [0, 199], label: 'Até R$ 199' },
  { value: [200, 399], label: 'R$ 200 - R$ 399' },
  { value: [400, 599], label: 'R$ 400 - R$ 599' },
  { value: [600, 99999], label: 'R$ 600+' }
];

const STATUS = [
  { value: 'disponível', label: 'Disponível' },
  { value: 'vendida', label: 'Vendida' }
];

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    '&:hover': {
      borderColor: '#EFD9A5'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1F2937',
    border: '1px solid #374151'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#374151' : 'transparent',
    '&:hover': {
      backgroundColor: '#374151'
    }
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff'
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff'
  })
};

const TattooFilters: React.FC<TattooFiltersProps> = ({
  onStyleChange,
  onPriceRangeChange,
  onStatusChange,
  onSearchChange,
  selectedStyle,
  selectedPriceRange,
  selectedStatus,
  searchTerm
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onStyleChange('');
    onPriceRangeChange([0, 99999]);
    onStatusChange('disponível');
    onSearchChange('');
  };

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 mb-8 transition-all">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tatuagens..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink-gold focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="text-ink-gold mr-2" size={24} />
          <h2 className="text-xl font-semibold">Filtros</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-ink-gold hover:text-ink-gold/80 transition-colors text-sm"
        >
          {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estilo */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Estilo
              </label>
              <Select
                options={STYLES}
                value={STYLES.find(style => style.value === selectedStyle)}
                onChange={(option) => onStyleChange(option?.value || '')}
                styles={customSelectStyles}
                isSearchable={false}
                className="text-sm"
              />
            </div>

            {/* Faixa de Preço */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Faixa de Preço
              </label>
              <Select
                options={PRICE_RANGES}
                value={PRICE_RANGES.find(range => 
                  range.value[0] === selectedPriceRange[0] && 
                  range.value[1] === selectedPriceRange[1]
                )}
                onChange={(option) => onPriceRangeChange(option?.value || [0, 99999])}
                styles={customSelectStyles}
                isSearchable={false}
                className="text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status
              </label>
              <Select
                options={STATUS}
                value={STATUS.find(status => status.value === selectedStatus)}
                onChange={(option) => onStatusChange(option?.value || 'disponível')}
                styles={customSelectStyles}
                isSearchable={false}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-ink-gold hover:text-ink-gold/80 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TattooFilters;