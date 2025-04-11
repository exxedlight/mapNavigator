import { NextRequest, NextResponse } from 'next/server';
import { runQuery, runModifyQuery } from '@/db/query';
import { User } from '@/types/db';

export async function GET() {
  const users = await runQuery<User>('SELECT * FROM Users');
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { login, password, phone, role } = body;

  const result = await runModifyQuery(
    'INSERT INTO Users (login, password, phone, role) VALUES (?, ?, ?, ?)',
    [login, password, phone, role]
  );

  return NextResponse.json({ id: result.insertId });
}
