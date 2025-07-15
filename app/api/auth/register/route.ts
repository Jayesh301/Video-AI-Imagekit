import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "@/app/lib/db";
import User from "@/app/models/User";


export async function POST(request: NextRequest){
    try{
        const {email, password} = await request.json();
        if(!email || !password){
            return NextResponse.json({message: "Email and password are required"}, {status: 400});
        }
        await connectToDataBase();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        await User.create({email, password});
        return NextResponse.json({message: "User created successfully"}, {status: 400});

    }
    catch(error){
        console.error("Error in register route", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
} 