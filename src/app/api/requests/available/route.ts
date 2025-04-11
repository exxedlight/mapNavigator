import { runQuery } from "@/db/query";
import { Request, Statuses } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const result = await runQuery(`select * from Requests where status = ? and timestamp >= ?`, [Statuses.pending, oneHourAgo.toISOString().replace('T',' ').split('.')[0]]);
    
    return NextResponse.json(result);
}