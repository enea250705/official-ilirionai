import { NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { compare } from 'bcrypt-ts';
import { signIn } from '@/app/(auth)/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dhe fjalëkalimi janë të detyrueshme' },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await getUser(email);
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Kredenciale të pavlefshme' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordsMatch = await compare(password, users[0].password || '');
    if (!passwordsMatch) {
      return NextResponse.json(
        { message: 'Kredenciale të pavlefshme' },
        { status: 401 }
      );
    }

    // Sign in the user
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      { message: 'Hyrja u krye me sukses', user: { email: users[0].email, id: users[0].id } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Ndodhi një gabim gjatë hyrjes' },
      { status: 500 }
    );
  }
} 