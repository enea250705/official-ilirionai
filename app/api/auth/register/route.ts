import { NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/db/queries';
import { z } from 'zod';

// Define validation schema
const registerSchema = z.object({
  email: z.string().email({ message: 'Email i pavlefshëm' }),
  password: z.string().min(6, { message: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere' }),
});

export async function POST(request: Request) {
  try {
    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { message: 'Kërkesë e pavlefshme' },
        { status: 400 }
      );
    }
    
    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten();
      return NextResponse.json(
        { 
          message: 'Të dhëna të pavlefshme',
          errors: errors.fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { email, password } = body;

    // Check if user already exists
    const existingUsers = await getUser(email);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Ky email është regjistruar tashmë' },
        { status: 409 }
      );
    }

    try {
      // Create new user
      await createUser(email, password);
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { message: 'Ndodhi një gabim gjatë krijimit të llogarisë' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Regjistrimi u krye me sukses' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Ndodhi një gabim gjatë regjistrimit' },
      { status: 500 }
    );
  }
} 