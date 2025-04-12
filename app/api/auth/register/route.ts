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
    const body = await request.json();
    
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

    // Create new user
    await createUser(email, password);

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