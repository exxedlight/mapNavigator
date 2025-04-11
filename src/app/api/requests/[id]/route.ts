// GET, PUT, DELETE for a single request
import { runQuery, runModifyQuery } from '@/db/query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const data = await runQuery('SELECT * FROM Requests WHERE id = ?', [params.id]);
  return NextResponse.json(data[0] || null);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await runModifyQuery('DELETE FROM Requests WHERE id = ?', [params.id]);
  return NextResponse.json({ success: true });
}
