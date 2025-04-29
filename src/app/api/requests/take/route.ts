import { runModifyQuery, runQuery } from "@/db/query";
import { Statuses } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {driverId, requestId} = await req.json();

    const checkOut = await runQuery(`select * from Requests where id = ? and status = ?`, [requestId, Statuses.pending]);
    if(!checkOut || checkOut.length < 1){
        return NextResponse.json({success: false});
    }

    const res1 = await runModifyQuery(`update Requests set status = ? where id = ?`, [Statuses.working, requestId]);
    /*
        driverId INT NOT NULL,
        requestId INT NOT NULL,
    */
    const res2 = await runModifyQuery(`insert into Records (driverId, requestId) values (?, ?)`, [driverId, requestId]);

    return NextResponse.json({success: true});
}