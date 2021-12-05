import { createContext, useEffect, useState } from 'react';

import { api } from './services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionContextData {
  transactions: Transaction[];
  createTransaction: (transactionInput: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext({} as TransactionContextData);

const TransactionsProvider: React.FC = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get('/transactions')
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    try {
      const response = await api.post('transactions', {
        ...transactionInput,
        createdAt: new Date(),
      });

      const { transaction } = response.data;

      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
export { TransactionsContext, TransactionsProvider };
