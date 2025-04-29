import { runModifyQuery } from "@/db/query";
import { Statuses } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {id} = await req.json();

    await runModifyQuery(`update Requests set status = ? where id = ?`, [Statuses.done, id]);

    return NextResponse.json({success: true});
}