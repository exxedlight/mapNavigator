import { runQuery } from "@/db/query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {id} = await req.json();

    const result = await runQuery<string>(`select phone from Users where id = ?`, [id]);

    return NextResponse.json(result);
}