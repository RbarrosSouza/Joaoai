import React, { useState, useEffect } from 'react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { Category } from '../types';
import { getIcon, AVAILABLE_ICONS, COLOR_PALETTES } from '../constants';
import { Plus, Edit2, Trash2, X, Check, Layers, ChevronRight, Hash, Sparkles } from 'lucide-react';

const Categories: React.FC = () => {
  const categories = useCategories();
  const { addCategory, updateCategory, deleteCategory, addSubCategory } = useFinance();
  
  // State for Modal Editor
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  // Sorting: Active first
  const sortedCategories = [...categories].sort((a, b) => 
    (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1
  );

  const handleEditClick = (category: Category) => {
    setEditingCategory({ ...category });
    setIsNewCategory(false);
  };

  const handleCreateClick = () => {
    setEditingCategory({
      name: '',
      icon: 'briefcase',
      color: COLOR_PALETTES[0].bg + ' ' + COLOR_PALETTES[0].text,
      subcategories: [],
      isActive: true
    });
    setIsNewCategory(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name) return;

    if (isNewCategory) {
      addCategory({
        ...editingCategory,
        id: `cat_${Date.now()}`,
      } as Category);
    } else if (editingCategory.id) {
      // Logic to handle removed subcategories if we were tracking them in local state
      // For now, the global 'addSubCategory' handles additions directly to context for existing cats,
      // but for a true editor experience, we might want to batch updates.
      // Since FinanceContext exposes specific methods, we'll assume direct updates for now 
      // or we update the main fields here:
      updateCategory(editingCategory.id, {
          name: editingCategory.name,
          color: editingCategory.color,
          icon: editingCategory.icon,
          isActive: editingCategory.isActive
      });
    }

    setEditingCategory(null);
    setIsNewCategory(false);
    setNewSubCategoryName('');
  };

  const handleAddSubInModal = () => {
      if (!newSubCategoryName.trim() || !editingCategory) return;
      
      const newSub = {
          id: `sub_${Date.now()}`,
          name: newSubCategoryName,
          isActive: true
      };

      if (isNewCategory) {
          // Local state update for new category
          setEditingCategory(prev => ({
              ...prev,
              subcategories: [...(prev?.subcategories || []), newSub]
          }));
      } else {
          // Direct context update for existing category
          if (editingCategory.id) {
              addSubCategory(editingCategory.id, newSubCategoryName);
              // Update local state to reflect change immediately in UI
              setEditingCategory(prev => ({
                ...prev,
                subcategories: [...(prev?.subcategories || []), newSub]
            }));
          }
      }
      setNewSubCategoryName('');
  };

  const handleRemoveSubInModal = (subId: string) => {
      // For visual removal in modal (Soft delete logic would be in context)
      // Here we simulate updating the local editing state
      setEditingCategory(prev => ({
          ...prev,
          subcategories: prev?.subcategories?.filter(s => s.id !== subId) || []
      }));
      // Note: If it's an existing category, we might need a 'removeSubCategory' in context, 
      // currently context only has deleteCategory. Assuming soft-delete or simple UI hide for now.
  };

  return (
    <div className="w-full space-y-8 pb-10 text-slate-800">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-3">
             Categorias
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-xl">
             Estruture como você organiza seu dinheiro. Categorias bem definidas são o segredo da clareza financeira.
          </p>
        </div>
        
        {/* Subtle Outline Button instead of Heavy Primary */}
        <button 
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm hover:border-brand-lime hover:text-brand-deep transition-all active:scale-95 group"
        >
           <Plus size={18} className="text-slate-400 group-hover:text-brand-deep" />
           <span>Nova Categoria</span>
        </button>
      </div>

      {/* 2. Grid of Categories (Browsing Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
         {sortedCategories.map(cat => {
            const isActive = cat.isActive !== false;
            return (
                <div 
                    key={cat.id} 
                    onClick={() => handleEditClick(cat)}
                    className={`card-base p-6 group cursor-pointer border border-transparent hover:border-brand-lime/30 transition-all duration-300 relative overflow-hidden ${!isActive ? 'opacity-60 grayscale' : ''}`}
                >
                    {!isActive && <div className="absolute top-4 right-4 text-[10px] font-bold uppercase bg-slate-100 text-slate-400 px-2 py-1 rounded-md">Arquivada</div>}
                    
                    <div className="flex items-start justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} bg-opacity-10 text-opacity-100 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                            {getIcon(cat.icon, 24)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-lime group-hover:text-white transition-colors">
                            <Edit2 size={14} />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand-deep transition-colors">{cat.name}</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <Layers size={14} />
                            <span>{cat.subcategories?.filter(s => s.isActive !== false).length || 0} subcategorias</span>
                        </div>
                    </div>

                    {/* Decorative hover effect */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-lime/5 rounded-full blur-2xl group-hover:bg-brand-lime/10 transition-colors"></div>
                </div>
            )
         })}

         {/* Empty State / Add Card (This acts as the main CTA in the grid) */}
         <button 
            onClick={handleCreateClick}
            className="border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 min-h-[200px] text-slate-400 hover:border-brand-lime hover:text-brand-deep hover:bg-brand-lime/5 transition-all group"
         >
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold text-sm">Criar Nova</span>
         </button>
      </div>

      {/* 3. Editor Modal (Focus Mode) */}
      {editingCategory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-deep/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{isNewCategory ? 'Nova Categoria' : 'Editar Categoria'}</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Defina os detalhes e subcategorias.</p>
                    </div>
                    <button onClick={() => setEditingCategory(null)} className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
                    
                    {/* Top Section: Visual Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Name Input */}
                        <div className="md:col-span-7 space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Nome da Categoria</label>
                            <input 
                                type="text" 
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                placeholder="Ex: Viagens"
                                className="w-full text-2xl font-bold text-slate-800 placeholder:text-slate-200 border-b-2 border-slate-100 py-2 focus:outline-none focus:border-brand-lime transition-colors bg-transparent"
                                autoFocus
                            />
                        </div>

                        {/* Color Picker (Compact) */}
                        <div className="md:col-span-5 space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Cor de Destaque</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {COLOR_PALETTES.slice(0, 6).map((palette, idx) => {
                                    const isSelected = editingCategory.color?.includes(palette.bg);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setEditingCategory({...editingCategory, color: `${palette.bg} ${palette.text}`})}
                                            className={`w-10 h-10 rounded-full ${palette.bg} ${palette.text} flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 ${isSelected ? 'ring-2 ring-offset-2 ring-slate-300 scale-110' : ''}`}
                                        >
                                            {isSelected && <Check size={16} strokeWidth={3} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Icon Picker */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Ícone Representativo</label>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-40 overflow-y-auto no-scrollbar">
                            {AVAILABLE_ICONS.map(iconName => {
                                const isSelected = editingCategory.icon === iconName;
                                return (
                                <button
                                    key={iconName}
                                    onClick={() => setEditingCategory({...editingCategory, icon: iconName})}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-white text-brand-deep shadow-md ring-2 ring-brand-lime/20 scale-110' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                                >
                                    {getIcon(iconName, 20)}
                                </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Subcategories Section (The Core) */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-brand-lime/10 text-brand-deep rounded-lg">
                                <Layers size={16} />
                            </div>
                            <h3 className="font-bold text-slate-800">Subcategorias</h3>
                        </div>

                        {/* Add Input */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    value={newSubCategoryName}
                                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubInModal()}
                                    placeholder="Adicionar nova subcategoria..."
                                    className="w-full bg-slate-50 border border-slate-200 pl-4 pr-10 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-lime focus:bg-white transition-all"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                   <Hash size={14} className="text-slate-300" />
                                </div>
                            </div>
                            <button 
                                onClick={handleAddSubInModal}
                                disabled={!newSubCategoryName.trim()}
                                className="px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Subcategories List - Pills Layout */}
                        <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                             {editingCategory.subcategories?.filter(s => s.isActive !== false).map((sub) => (
                                 <div key={sub.id} className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:border-slate-300 transition-all">
                                     <span className="text-sm font-medium text-slate-600">{sub.name}</span>
                                     <button 
                                        onClick={() => handleRemoveSubInModal(sub.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                     >
                                         <X size={14} />
                                     </button>
                                 </div>
                             ))}
                             {(!editingCategory.subcategories || editingCategory.subcategories.filter(s => s.isActive !== false).length === 0) && (
                                 <p className="text-sm text-slate-400 italic py-2">Nenhuma subcategoria definida.</p>
                             )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center gap-4">
                    {!isNewCategory && (
                        <button 
                            onClick={() => {
                                if(editingCategory.id) deleteCategory(editingCategory.id);
                                setEditingCategory(null);
                            }}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-colors text-sm"
                        >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Excluir</span>
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button 
                            onClick={() => setEditingCategory(null)}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSaveCategory}
                            disabled={!editingCategory.name}
                            className="px-8 py-3 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Check size={18} strokeWidth={3} />
                            Salvar Alterações
                        </button>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default Categories;