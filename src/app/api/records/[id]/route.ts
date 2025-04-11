// GET, PUT, DELETE for a single record
import { runQuery, runModifyQuery } from '@/db/query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const data = await runQuery('SELECT * FROM Records WHERE id = ?', [params.id]);
  return NextResponse.json(data[0] || null);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await runModifyQuery(
    'UPDATE Records SET requestId = ?, userId = ?, comment = ?, createdAt = ? WHERE id = ?',
    [body.requestId, body.userId, body.comment, body.createdAt, params.id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await runModifyQuery('DELETE FROM Records WHERE id = ?', [params.id]);
  return NextResponse.json({ success: true });
}
