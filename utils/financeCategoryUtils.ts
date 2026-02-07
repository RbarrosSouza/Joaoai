import { Category, SubCategory } from '../types';

export interface ResolvedCategory {
    category: Category | undefined;
    subCategory: SubCategory | undefined;
}

/**
 * Resolves a category and subcategory from a single ID.
 * The ID could be either a Parent Category ID or a Subcategory ID.
 */
export function resolveCategory(id: string, categories: Category[]): ResolvedCategory {
    if (!id) return { category: undefined, subCategory: undefined };

    // 1. Try to find the category as a parent
    const parentCategory = categories.find(c => c.id === id);
    if (parentCategory) {
        return { category: parentCategory, subCategory: undefined };
    }

    // 2. Try to find the category as a subcategory
    for (const cat of categories) {
        if (cat.subcategories) {
            const sub = cat.subcategories.find(s => s.id === id);
            if (sub) {
                return { category: cat, subCategory: sub };
            }
        }
    }

    return { category: undefined, subCategory: undefined };
}
