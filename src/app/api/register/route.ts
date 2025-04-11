import { runModifyQuery, runQuery } from "@/db/query";
import { Roles } from "@/types/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {login, password, phone} = await req.json();

    const loginExists = await runQuery(`select * from Users where login = ?`, [login]);
    if(loginExists && loginExists.length > 0)
        return NextResponse.json({success: false, message: "Логін вже використовується"});

    const phoneExists = await runQuery(`select * from Users where phone = ?`, [phone]);
    if(phoneExists && phoneExists.length > 0)
        return NextResponse.json({success: false, message: "Телефон вже використовується"});

    const result = await runModifyQuery(`insert into Users (login, password, phone, role) values (?, ?, ?, ?)`, [login, password, phone, Roles.user]);

    return NextResponse.json({success: true});
}