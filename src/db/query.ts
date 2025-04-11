import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from './pool';

// Для SELECT-запросов (возвращают данные)
export async function runQuery<T = any>(query: string, values: any[] = []): Promise<T[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(RowDataPacket & T)[]>(query, values);
    return rows as T[];
  } finally {
    connection.release();
  }
}

// Для INSERT/UPDATE/DELETE-запросов (возвращают метаданные)
export async function runModifyQuery(query: string, values: any[] = []): Promise<ResultSetHeader> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute<ResultSetHeader>(query, values);
    return result;
  } finally {
    connection.release();
  }
}