import { NextRequest, NextResponse } from 'next/server';
import { runQuery, runModifyQuery } from '@/db/query';
import { User } from '@/types/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const [user] = await runQuery<User>('SELECT * FROM Users WHERE id = ?', [params.id]);
  return NextResponse.json(user || null);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { login, password, phone, role } = body;

  await runModifyQuery(
    'UPDATE Users SET login = ?, password = ?, phone = ?, role = ? WHERE id = ?',
    [login, password, phone, role, params.id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await runModifyQuery('DELETE FROM Users WHERE id = ?', [params.id]);
  return NextResponse.json({ success: true });
}
