// GET all requests, POST new request
import { runQuery, runModifyQuery } from '@/db/query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const requests = await runQuery('SELECT * FROM Requests');
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await runModifyQuery(
    'INSERT INTO Requests (userId, StartLat, StartLng, EndLat, EndLng, timestamp, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [body.userId, body.startLat, body.startLng, body.endLat, body.endLng, body.timestamp, body.status, body.price]
  );
  return NextResponse.json({ id: result.insertId });
}
