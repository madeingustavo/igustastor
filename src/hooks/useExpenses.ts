
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Expense } from '../types/schema';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(AppStorageManager.getExpenses());
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  // Sync with localStorage whenever expenses change
  useEffect(() => {
    AppStorageManager.saveExpenses(expenses);
  }, [expenses]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new expense
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
    };

    setExpenses(prev => [...prev, newExpense]);
    toast.success(`Despesa de R$${expenseData.amount.toFixed(2)} adicionada com sucesso!`);
    return newExpense;
  };

  // Update an existing expense
  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...expense, ...expenseData } 
          : expense
      )
    );
    toast.success('Despesa atualizada com sucesso!');
  };

  // Remove an expense
  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.info('Despesa removida.');
  };

  // Remove multiple expenses
  const removeMultipleExpenses = (ids: string[]) => {
    if (ids.length === 0) return;
    
    setExpenses(prev => prev.filter(expense => !ids.includes(expense.id)));
    toast.info(`${ids.length} despesa(s) removidas.`);
    setSelectedExpenses([]);
  };

  // Toggle expense selection
  const toggleExpenseSelection = (id: string) => {
    setSelectedExpenses(prev => 
      prev.includes(id) ? prev.filter(expenseId => expenseId !== id) : [...prev, id]
    );
  };

  // Select all expenses
  const selectAllExpenses = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(expense => expense.id));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedExpenses([]);
  };

  // Get expense by ID
  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  // Get expenses by device ID
  const getExpensesByDeviceId = (deviceId: string) => {
    return expenses.filter(expense => expense.device_id === deviceId);
  };

  // Get expenses by category
  const getExpensesByCategory = (category: string) => {
    return expenses.filter(expense => expense.category === category);
  };

  // Get today's expenses
  const getTodayExpenses = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return format(expenseDate, 'yyyy-MM-dd') === todayStr;
    });
  };

  // Get total today's expenses
  const getTodayExpensesTotal = () => {
    return getTodayExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  // Get monthly expenses
  const getMonthlyExpenses = () => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { 
        start: firstDayOfMonth, 
        end: lastDayOfMonth 
      });
    });
  };

  // Get total monthly expenses
  const getMonthlyExpensesTotal = () => {
    return getMonthlyExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  // Get all expense categories
  const getAllCategories = () => {
    const categories = new Set<string>();
    expenses.forEach(expense => categories.add(expense.category));
    return Array.from(categories).sort();
  };

  // Get expenses breakdown by category
  const getExpensesByCategories = () => {
    const categories = getAllCategories();
    const result: { category: string; amount: number }[] = [];
    
    categories.forEach(category => {
      const categoryExpenses = getExpensesByCategory(category);
      const totalAmount = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
      
      result.push({
        category,
        amount: totalAmount
      });
    });
    
    return result.sort((a, b) => b.amount - a.amount);
  };

  return {
    expenses,
    selectedExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    removeMultipleExpenses,
    toggleExpenseSelection,
    selectAllExpenses,
    clearSelection,
    getExpenseById,
    getExpensesByDeviceId,
    getExpensesByCategory,
    getTodayExpenses,
    getTodayExpensesTotal,
    getMonthlyExpenses,
    getMonthlyExpensesTotal,
    getAllCategories,
    getExpensesByCategories
  };
};
