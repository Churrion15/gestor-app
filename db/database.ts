import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gastos.db');

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      // Tabla de categorías
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        );`,
        [],
        (_, result) => console.log('Tabla categories creada'),
        (_, error) => {
          console.error('Error al crear tabla categories:', error);
          reject(error);
        }
      );

      // Tabla de gastos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          FOREIGN KEY(category_id) REFERENCES categories(id)
        );`,
        [],
        (_, result) => {
          console.log('Tabla expenses creada');
          resolve();
        },
        (_, error) => {
          console.error('Error al crear tabla expenses:', error);
          reject(error);
        }
      );
    });
  });
};

export const insertCategory = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO categories (name) VALUES (?)',
        [name],
        (_, result) => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertExpense = (expense: {
  id: string;
  title: string;
  amount: number;
  category_id: number;
  date: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        'INSERT INTO expenses (id, title, amount, category_id, date) VALUES (?, ?, ?, ?, ?)',
        [
          expense.id,
          expense.title,
          expense.amount,
          expense.category_id,
          expense.date,
        ],
        (_, result) => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const getCategories = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        'SELECT * FROM categories',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};