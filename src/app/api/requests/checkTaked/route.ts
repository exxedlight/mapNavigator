import { runQuery } from "@/db/query";
import { Statuses } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {id} = await req.json();

    const rows = await runQuery(`select * from Requests where id = ? and status = ?`, [id, Statuses.working]);

    if(rows.length < 1)
        return NextResponse.json({success: false});

    return NextResponse.json({success: true});
}