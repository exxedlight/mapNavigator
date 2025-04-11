import { runQuery } from "@/db/query";
import { User } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {login, password} = await req.json();
    const result = await runQuery<User>(`select * from Users where login = ?`, [login]);
    
    if(!result || result.length < 1 || result[0].password != password)
        return NextResponse.json({success: false});
    
    return NextResponse.json({
        success: true,
        userId: result[0].id,
        userLogin: result[0].login,
        role: result[0].role
    });
}