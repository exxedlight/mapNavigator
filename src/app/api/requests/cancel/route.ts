import { runModifyQuery } from "@/db/query";
import { Statuses } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {id} = await req.json();

    const result = runModifyQuery(`update Requests set status = ${Statuses.canceled} where id = ?`, [id]);

    return NextResponse.json({success: true});
}