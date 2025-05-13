import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTattoo } from '../../context/TattooContext';
import TattooCard from '../tattoo/TattooCard';
import TattooFilters from '../tattoo/TattooFilters';

const Collection: React.FC = () => {
  const { tattoos, loading, error, hasMore, fetchTattoos } = useTattoo();
  const [filteredTattoos, setFilteredTattoos] = useState(tattoos);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 99999]);
  const [selectedStatus, setSelectedStatus] = useState('disponível');
  const [searchTerm, setSearchTerm] = useState('');

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    const filtered = tattoos.filter(tattoo => {
      const matchesStyle = !selectedStyle || tattoo.style === selectedStyle;
      const matchesPrice = tattoo.price >= selectedPriceRange[0] && tattoo.price <= selectedPriceRange[1];
      const matchesStatus = tattoo.status === selectedStatus;
      const matchesSearch = !searchTerm || 
        tattoo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tattoo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tattoo.style.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStyle && matchesPrice && matchesStatus && matchesSearch;
    });
    setFilteredTattoos(filtered);
  }, [tattoos, selectedStyle, selectedPriceRange, selectedStatus, searchTerm]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchTattoos();
    }
  }, [inView, hasMore, loading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (loading && tattoos.length === 0) {
    return (
      <div className="section bg-gradient-to-b from-ink-black to-gray-900 relative">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-gold mx-auto"></div>
          <p className="text-gray-400 mt-4">Carregando coleção...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section bg-gradient-to-b from-ink-black to-gray-900 relative">
        <div className="container-custom text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section id="collection" className="section bg-gradient-to-b from-ink-black to-gray-900 relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="gradient-text inline-block mb-4">Coleção Exclusiva</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Cada desenho é único e feito com paixão. 
            Quando você o adquire, ele se torna exclusivamente seu e será removido de nosso catálogo permanentemente.
          </p>
        </div>

        <TattooFilters
          onStyleChange={setSelectedStyle}
          onPriceRangeChange={setSelectedPriceRange}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchTerm}
          selectedStyle={selectedStyle}
          selectedPriceRange={selectedPriceRange}
          selectedStatus={selectedStatus}
          searchTerm={searchTerm}
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredTattoos.map((tattoo) => (
            <TattooCard key={tattoo.id} tattoo={tattoo} />
          ))}
        </motion.div>

        {filteredTattoos.length === 0 && (
          <div className="text-center p-16 border border-gray-800 rounded-lg">
            <h3 className="text-2xl font-display mb-4">Nenhuma tatuagem encontrada</h3>
            <p className="text-gray-400">
              Não encontramos tatuagens com os filtros selecionados. Tente ajustar seus critérios de busca.
            </p>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10 mt-8">
          {loading && hasMore && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink-gold mx-auto"></div>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-ink-gold italic font-display text-lg">
            "Após a compra, essa arte será sua para sempre. Ela sairá do catálogo."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Collection;