
import React from 'react';
import { Account, AccountType, Category, CreditCard, Transaction, TransactionType } from './types';
import { Wallet, Landmark, PiggyBank, Briefcase, ShoppingBag, Coffee, Home, Car, Zap, HeartPulse, GraduationCap, Plane, Music, Smartphone, Gift, Wrench, Baby, Dog, Gamepad2, Shirt } from 'lucide-react';

export const BANK_PRESETS = [
  { name: 'Nubank', colorFrom: 'from-purple-600', colorTo: 'to-purple-800' },
  { name: 'Itaú', colorFrom: 'from-orange-500', colorTo: 'to-blue-900' },
  { name: 'Bradesco', colorFrom: 'from-red-600', colorTo: 'to-red-800' },
  { name: 'Inter', colorFrom: 'from-orange-400', colorTo: 'to-orange-600' },
  { name: 'Santander', colorFrom: 'from-red-500', colorTo: 'to-red-700' },
  { name: 'C6 Bank', colorFrom: 'from-slate-800', colorTo: 'to-black' },
  { name: 'BTG Pactual', colorFrom: 'from-blue-800', colorTo: 'to-slate-900' },
  { name: 'Banco do Brasil', colorFrom: 'from-yellow-400', colorTo: 'to-blue-800' },
  { name: 'Caixa', colorFrom: 'from-blue-500', colorTo: 'to-blue-700' },
  { name: 'Carteira Física', colorFrom: 'from-emerald-600', colorTo: 'to-emerald-800' },
  { name: 'Outro', colorFrom: 'from-slate-500', colorTo: 'to-slate-700' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { 
    id: '1', 
    name: 'Conta Principal', 
    bankName: 'Nubank',
    type: AccountType.CHECKING, 
    balance: 2450.50, 
    icon: 'landmark',
    colorFrom: 'from-purple-600',
    colorTo: 'to-purple-800'
  },
  { 
    id: '2', 
    name: 'Dinheiro Vivo', 
    bankName: 'Carteira',
    type: AccountType.WALLET, 
    balance: 120.00, 
    icon: 'wallet',
    colorFrom: 'from-emerald-600',
    colorTo: 'to-emerald-800'
  },
  { 
    id: '3', 
    name: 'Reserva Emergência', 
    bankName: 'Inter',
    type: AccountType.SAVINGS, 
    balance: 15000.00, 
    icon: 'piggy',
    colorFrom: 'from-orange-400',
    colorTo: 'to-orange-600'
  },
];

export const INITIAL_CARDS: CreditCard[] = [
  { 
    id: 'c1', 
    name: 'Nubank Roxinho', 
    brand: 'Mastercard', 
    limit: 10000, 
    closingDay: 5, 
    dueDay: 10, 
    currentBill: 1240.50,
    colorFrom: 'from-violet-500',
    colorTo: 'to-fuchsia-500'
  },
  { 
    id: 'c2', 
    name: 'XP Visa Infinite', 
    brand: 'Visa', 
    limit: 25000, 
    closingDay: 20, 
    dueDay: 25, 
    currentBill: 450.00,
    colorFrom: 'from-slate-700',
    colorTo: 'to-slate-900'
  }
];

export const CATEGORIES: Category[] = [
  { 
    id: 'cat_food', 
    name: 'Alimentação', 
    icon: 'coffee', 
    color: 'bg-orange-100 text-orange-600', 
    isActive: true,
    budget: 1200,
    subcategories: [
      { id: 'sub_groceries', name: 'Supermercado', isActive: true },
      { id: 'sub_restaurants', name: 'Restaurantes', isActive: true },
      { id: 'sub_delivery', name: 'Delivery', isActive: true },
      { id: 'sub_snacks', name: 'Lanches/Café', isActive: true }
    ]
  },
  { 
    id: 'cat_housing', 
    name: 'Moradia', 
    icon: 'home', 
    color: 'bg-blue-100 text-blue-600', 
    isActive: true,
    budget: 2500,
    subcategories: [
      { id: 'sub_rent', name: 'Aluguel/Condomínio', isActive: true },
      { id: 'sub_utilities', name: 'Luz/Água/Gás', isActive: true },
      { id: 'sub_internet', name: 'Internet/TV', isActive: true },
      { id: 'sub_maintenance', name: 'Manutenção', isActive: true }
    ]
  },
  { 
    id: 'cat_transport', 
    name: 'Transporte', 
    icon: 'car', 
    color: 'bg-green-100 text-green-600', 
    isActive: true,
    budget: 600,
    subcategories: [
      { id: 'sub_fuel', name: 'Combustível', isActive: true },
      { id: 'sub_uber', name: 'Uber/Táxi', isActive: true },
      { id: 'sub_public_transport', name: 'Transporte Público', isActive: true },
      { id: 'sub_parking', name: 'Estacionamento', isActive: true },
      { id: 'sub_vehicle_maintenance', name: 'Manutenção/IPVA', isActive: true }
    ]
  },
  { 
    id: 'cat_shopping', 
    name: 'Compras', 
    icon: 'shopping-bag', 
    color: 'bg-pink-100 text-pink-600', 
    isActive: true,
    budget: 800,
    subcategories: [
      { id: 'sub_clothes', name: 'Roupas', isActive: true },
      { id: 'sub_electronics', name: 'Eletrônicos', isActive: true },
      { id: 'sub_personal_care', name: 'Cuidados Pessoais', isActive: true },
      { id: 'sub_gifts', name: 'Presentes', isActive: true }
    ]
  },
  { 
    id: 'cat_health', 
    name: 'Saúde', 
    icon: 'heart', 
    color: 'bg-red-100 text-red-600', 
    isActive: true,
    budget: 400,
    subcategories: [
      { id: 'sub_pharmacy', name: 'Farmácia', isActive: true },
      { id: 'sub_doctor', name: 'Consultas', isActive: true },
      { id: 'sub_gym', name: 'Academia', isActive: true }
    ]
  },
  { 
    id: 'cat_leisure', 
    name: 'Lazer', 
    icon: 'zap', 
    color: 'bg-purple-100 text-purple-600', 
    isActive: true,
    budget: 500,
    subcategories: [
      { id: 'sub_cinema', name: 'Cinema/Streaming', isActive: true },
      { id: 'sub_travel', name: 'Viagens', isActive: true },
      { id: 'sub_hobbies', name: 'Hobbies', isActive: true }
    ]
  },
  { 
    id: 'cat_education', 
    name: 'Educação', 
    icon: 'grad', 
    color: 'bg-yellow-100 text-yellow-600', 
    isActive: true,
    budget: 300,
    subcategories: [
      { id: 'sub_courses', name: 'Cursos', isActive: true },
      { id: 'sub_books', name: 'Livros', isActive: true }
    ]
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    amount: 45.00,
    description: 'Café da Tarde',
    date: new Date().toISOString(),
    type: TransactionType.EXPENSE,
    categoryId: 'cat_food',
    subCategoryId: 'sub_snacks',
    accountId: '1',
    isPending: false,
    frequency: 'SINGLE'
  },
  {
    id: 't2',
    amount: 5500.00,
    description: 'Projeto Freelance',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    type: TransactionType.INCOME,
    categoryId: 'cat_shopping', // Placeholder category for income
    accountId: '1',
    isPending: false,
    frequency: 'SINGLE'
  },
  {
    id: 't3',
    amount: 129.90,
    description: 'Assinatura Netflix',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    type: TransactionType.EXPENSE,
    categoryId: 'cat_leisure',
    subCategoryId: 'sub_cinema',
    cardId: 'c1',
    isPending: false,
    frequency: 'RECURRING'
  }
];

export const AVAILABLE_ICONS = [
  'wallet', 'landmark', 'piggy', 'shopping-bag', 'coffee', 'home', 'car', 'zap', 'heart', 'grad', 'plane', 'briefcase', 'music', 'smartphone', 'gift', 'wrench', 'baby', 'dog', 'gamepad', 'shirt'
];

export const COLOR_PALETTES = [
  { bg: 'bg-slate-100', text: 'text-slate-600' },
  { bg: 'bg-red-100', text: 'text-red-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
  { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'bg-lime-100', text: 'text-lime-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  { bg: 'bg-sky-100', text: 'text-sky-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'bg-violet-100', text: 'text-violet-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-rose-100', text: 'text-rose-600' },
];

export const getIcon = (name: string, size: number = 20) => {
  switch (name) {
    case 'wallet': return <Wallet size={size} />;
    case 'landmark': return <Landmark size={size} />;
    case 'piggy': return <PiggyBank size={size} />;
    case 'shopping-bag': return <ShoppingBag size={size} />;
    case 'coffee': return <Coffee size={size} />;
    case 'home': return <Home size={size} />;
    case 'car': return <Car size={size} />;
    case 'zap': return <Zap size={size} />;
    case 'heart': return <HeartPulse size={size} />;
    case 'grad': return <GraduationCap size={size} />;
    case 'plane': return <Plane size={size} />;
    case 'music': return <Music size={size} />;
    case 'smartphone': return <Smartphone size={size} />;
    case 'gift': return <Gift size={size} />;
    case 'wrench': return <Wrench size={size} />;
    case 'baby': return <Baby size={size} />;
    case 'dog': return <Dog size={size} />;
    case 'gamepad': return <Gamepad2 size={size} />;
    case 'shirt': return <Shirt size={size} />;
    default: return <Briefcase size={size} />;
  }
};
