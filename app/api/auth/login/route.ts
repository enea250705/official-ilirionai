import { NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { compare } from 'bcrypt-ts';
import { signIn } from '@/app/(auth)/auth';

export async function POST(request: Request) {
  try {
    // Parse request body safely
    let email, password;
    try {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { message: 'Kërkesë e pavlefshme' },
        { status: 400 }
      );
    }

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

    try {
      // Sign in the user
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    } catch (signInError) {
      console.error('Sign in error:', signInError);
      return NextResponse.json(
        { message: 'Ndodhi një gabim me autentikimin' },
        { status: 500 }
      );
    }

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