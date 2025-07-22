import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(request: NextRequest){
    try{
        console.log("Registration API route called");
        
        // Parse request body
        const body = await request.json().catch(err => {
            console.error("Error parsing request body:", err);
            return null;
        });
        
        if (!body) {
            return NextResponse.json({error: "Invalid request body"}, {status: 400});
        }
        
        const {email, password} = body;
        console.log("Received registration request for email:", email);
        
        if(!email || !password){
            console.log("Missing email or password");
            return NextResponse.json({error: "Email and password are required"}, {status: 400});
        }
        
        // Connect to database
        try {
            await connectToDataBase();
            console.log("Connected to database");
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            return NextResponse.json({error: "Database connection failed"}, {status: 500});
        }
        
        // Check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log("User already exists:", email);
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }
        
        // Create user
        try {
            const newUser = await User.create({email, password});
            console.log("User created successfully:", email);
            return NextResponse.json({message: "User created successfully", userId: newUser._id}, {status: 201});
        } catch (userError) {
            console.error("Error creating user:", userError);
            return NextResponse.json({error: "Failed to create user"}, {status: 500});
        }
    }
    catch(error){
        console.error("Unexpected error in register route:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
} 