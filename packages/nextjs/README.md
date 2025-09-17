# @cipher-auth/next

# Quick Start

1. First, wrap your app with `CiperProvider`:

```typescript
// app/providers.tsx
"use client";

import { CiperProvider, createClient } from "@cipher-auth/next";

const client = createClient(
  "https://your-auth-service-url.com",
  "your-api-key"
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <CiperProvider client={client}>{children}</CiperProvider>;
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

2. Use in Server Components:

```typescript
// app/page.tsx
import { createClient } from "@cipher-auth/next";

const client = createClient(
  "https://your-auth-service-url.com",
  "your-api-key"
);

export default async function Page() {
  const user = await client.currentUser();
  if (!user) {
    return <div>Please log in</div>;
  }
  return <div>Welcome {user.name}</div>;
}
```

3. Use Authentication in Client Components:

````typescript
// app/auth/page.tsx
'use client';

import { useAuth } from '@cipher-auth/next';

export function AuthPage() {
  const { user, loading, signIn, signUp, logOut, isAuthenticated } = useAuth();

  const handleSignUp = async () => {
    try {
      const result = await signUp({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      });
      console.log('Signed up:', result.user);
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signIn({
        email: 'user@example.com',
        password: 'password123',
      });
      console.log('Signed in:', result.user);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome {user?.name}</h1>
        <p>{user?.email}</p>
        <button onClick={logOut}>Log Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
``` for Cipher Authentication Service with Server Component support.

## Installation

```bash
# Using npm
npm install @cipher-auth/next

# Using yarn
yarn add @cipher-auth/next

# Using pnpm
pnpm add @cipher-auth/next

# Using bun
bun add @cipher-auth/next
````

## Quick Start

```typescript
// app/api/auth/[...auth]/route.ts
import { createClient } from '@cipher-auth/next';

const client = createClient(
  'https://your-auth-service-url.com',
  'your-api-key',
);

// Can be used in Server Components or Route Handlers
export async function GET() {
  const user = await client.currentUser();
  if (!user) {
    return new Response('Not authenticated', { status: 401 });
  }
  return Response.json(user);
}
```

### Using in Server Components

```typescript
// app/page.tsx
import { createClient } from "@cipher-auth/next";

const client = createClient(
  "https://your-auth-service-url.com",
  "your-api-key"
);

export default async function Page() {
  const user = await client.currentUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## API Reference

### `createClient(authServiceUrl: string, apiKey: string)`

Creates (or returns an existing) Cipher client instance configured for Next.js.

- **Parameters:**
  - `authServiceUrl`: The base URL of your Cipher Authentication Service
  - `apiKey`: Your API key for authentication

- **Returns:** `NextCiperClient` instance

### `NextCiperClient`

A Next.js-specific client that automatically handles auth token extraction from the request context.

#### Methods

##### `currentUser(): Promise<CurrentUser | null>`

Fetches information about the currently authenticated user by automatically extracting the auth token from headers or cookies.

- **Returns:** Promise resolving to:
  - `CurrentUser` object if authenticated
  - `null` if not authenticated or token is invalid

  ```typescript
  interface CurrentUser {
    id: string;
    email: string;
    name: string;
    roles: Role[];
  }
  ```

## Error Handling

The client methods will:

- Return `null` for unauthenticated users
- Throw errors for API or network failures

Example error handling:

```typescript
try {
  const user = await client.currentUser();
  if (!user) {
    // Handle unauthenticated user
    return redirect('/login');
  }
  // User is authenticated
} catch (error) {
  // Handle API errors
  console.error('Error:', error);
}
```

## TypeScript Support

This package includes TypeScript type definitions. No additional `@types` packages are required.
