// GET all records, POST new record
import { runQuery, runModifyQuery } from '@/db/query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const records = await runQuery('SELECT * FROM Records');
    return NextResponse.json(records);
}

/*
Records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driverId INT NOT NULL,
    requestId INT NOT NULL,
    FOREIGN KEY (driverId) REFERENCES Users(id),
    FOREIGN KEY (requestId) REFERENCES Requests(id)
)
*/

export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = await runModifyQuery(
        'INSERT INTO Records (requestId, driverId) VALUES (?, ?)',
        [body.requestId, body.driverId]
    );
    return NextResponse.json({ id: result.insertId });
}
