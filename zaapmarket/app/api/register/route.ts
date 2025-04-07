import { registerUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, SessionUser } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    const user = await registerUser({ email, password, name });

    return NextResponse.json<ApiResponse<SessionUser>>(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}