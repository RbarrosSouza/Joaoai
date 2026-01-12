import React, { useState } from 'react';
import { useFinance, useCategories } from '../services/FinanceContext';
import { Category } from '../types';
import { getIcon, AVAILABLE_ICONS, COLOR_PALETTES } from '../constants';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Save, X, Layers, Check } from 'lucide-react';

const CategorySettings: React.FC = () => {
  const categories = useCategories();
  const { addCategory, updateCategory, deleteCategory, addSubCategory } = useFinance();
  
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

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
      updateCategory(editingCategory.id, editingCategory);
    }

    setEditingCategory(null);
    setIsNewCategory(false);
  };

  const handleAddSub = (categoryId: string) => {
    if (!newSubCategoryName.trim()) return;
    addSubCategory(categoryId, newSubCategoryName);
    setNewSubCategoryName('');
    setAddingSubTo(null);
  };

  const sortedCategories = [...categories].sort((a, b) => 
    (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1
  );

  if (editingCategory) {
    return (
      <div className="card-base p-8 animate-fade-in text-slate-800">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">{isNewCategory ? 'Nova Categoria' : 'Editar Categoria'}</h2>
          <button 
            onClick={() => setEditingCategory(null)}
            className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Name Input */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">Nome</label>
            <input 
              type="text" 
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
              placeholder="Ex: Lazer"
              className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-lime focus:ring-4 focus:ring-brand-lime/10 font-semibold text-slate-800 placeholder:text-slate-300 transition-all"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 block">Cor</label>
            <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {COLOR_PALETTES.map((palette, idx) => {
                const isSelected = editingCategory.color === `${palette.bg} ${palette.text}`;
                return (
                  <button
                    key={idx}
                    onClick={() => setEditingCategory({...editingCategory, color: `${palette.bg} ${palette.text}`})}
                    className={`w-10 h-10 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center transition-transform hover:scale-110 border-2 ${isSelected ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                  >
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 block">Ícone</label>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-56 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-4 no-scrollbar">
               {AVAILABLE_ICONS.map(iconName => {
                 const isSelected = editingCategory.icon === iconName;
                 return (
                   <button
                     key={iconName}
                     onClick={() => setEditingCategory({...editingCategory, icon: iconName})}
                     className={`aspect-square rounded-xl flex items-center justify-center transition-all bg-white shadow-sm border ${isSelected ? 'border-brand-lime ring-2 ring-brand-lime/20 text-brand-lime' : 'border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                   >
                     {getIcon(iconName, 20)}
                   </button>
                 )
               })}
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSaveCategory}
            disabled={!editingCategory.name}
            className="w-full py-4 bg-brand-deep text-brand-lime rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-brand-deep/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            Salvar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-slate-800">
      <div className="flex justify-between items-center px-1">
         <div>
            <h2 className="text-xl font-bold text-slate-800">Categorias</h2>
            <p className="text-sm text-slate-500 font-medium">Estrutura de organização.</p>
         </div>
         <button 
           onClick={handleCreateClick}
           className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:border-slate-300 transition-all"
         >
            <Plus size={18} />
            <span>Nova</span>
         </button>
      </div>

      <div className="space-y-4">
         {sortedCategories.map(cat => {
           const isExpanded = expandedCategories.includes(cat.id);
           const isActive = cat.isActive !== false;

           return (
             <div key={cat.id} className={`card-base rounded-2xl overflow-hidden transition-all ${!isActive ? 'opacity-50 grayscale' : ''}`}>
                
                {/* Category Header */}
                <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                   <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} bg-opacity-10`}>
                         {getIcon(cat.icon, 20)}
                      </div>
                      <span className={`font-bold ${isActive ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{cat.name}</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditClick(cat); }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                      >
                         <Edit2 size={16} />
                      </button>
                      
                      {isActive && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                      )}
                      
                      <button className="p-1 text-slate-300">
                         {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                   </div>
                </div>

                {/* Subcategories Panel */}
                {isExpanded && (
                   <div className="bg-slate-50/50 p-5 border-t border-slate-50">
                      <div className="space-y-2 mb-5">
                         {cat.subcategories.length === 0 && <p className="text-xs text-slate-400 pl-4 font-medium">Sem subcategorias.</p>}
                         
                         {cat.subcategories.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between pl-4 pr-2 py-2.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-100 group transition-all">
                               <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-lime transition-colors"></div>
                                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">{sub.name}</span>
                               </div>
                            </div>
                         ))}
                      </div>

                      {/* Add Subcategory Input */}
                      <div className="flex items-center gap-2 pl-4">
                         {addingSubTo === cat.id ? (
                            <div className="flex-1 flex items-center gap-2 animate-fade-in">
                               <input 
                                 autoFocus
                                 type="text" 
                                 value={newSubCategoryName}
                                 onChange={e => setNewSubCategoryName(e.target.value)}
                                 placeholder="Nome da subcategoria..."
                                 className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-lime text-slate-800"
                               />
                               <button 
                                 onClick={() => handleAddSub(cat.id)}
                                 className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                               >
                                  <Check size={14} />
                               </button>
                               <button 
                                 onClick={() => setAddingSubTo(null)}
                                 className="p-2 bg-slate-200 text-slate-500 rounded-lg hover:bg-slate-300"
                               >
                                  <X size={14} />
                               </button>
                            </div>
                         ) : (
                            <button 
                              onClick={() => setAddingSubTo(cat.id)}
                              className="text-xs font-bold text-slate-500 hover:text-brand-deep flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                            >
                               <Plus size={14} />
                               Adicionar Subcategoria
                            </button>
                         )}
                      </div>
                   </div>
                )}
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default CategorySettings;