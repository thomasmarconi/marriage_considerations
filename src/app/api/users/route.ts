import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { User } from "@/lib/types/types";

export async function POST(req: NextRequest) {
  try {
    const user: User = await req.json();

    // Validate the required fields
    if (!user.email || !user.name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Insert user into database
    const result = await query(
      "INSERT INTO users (id, email, name, image) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = $3, image = $4 RETURNING id",
      [
        user.id || crypto.randomUUID(),
        user.email,
        user.name,
        user.image || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        id: result.rows[0].id,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query<User>("SELECT * FROM users", []);

    return NextResponse.json(
      {
        users: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
