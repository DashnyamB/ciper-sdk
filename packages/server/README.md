# @cipher-auth/server

A TypeScript SDK for interacting with the Cipher Authentication Service.

## Installation

```bash
# Using npm
npm install @cipher-auth/server

# Using yarn
yarn add @cipher-auth/server

# Using pnpm
pnpm add @cipher-auth/server

# Using bun
bun add @cipher-auth/server
```

## Quick Start

```typescript
import { CiperClient } from '@cipher-auth/server';

// Initialize the client
const client = new CiperClient(
  'https://your-auth-service-url.com',
  'your-api-key',
);

// Get current user information
async function getCurrentUser(accessToken: string) {
  try {
    const user = await client.currentUser(accessToken);
    console.log(user);
    /*
    {
      id: string;
      email: string;
      name: string;
    }
    */
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
```

## API Reference

### `CiperClient`

The main class for interacting with the Cipher Authentication Service.

#### Constructor

```typescript
constructor(authServiceUrl: string, apiKey: string)
```

- `authServiceUrl`: The base URL of your Cipher Authentication Service
- `apiKey`: Your API key for authentication

#### Methods

##### `currentUser(accessToken: string): Promise<CurrentUser>`

Fetches information about the currently authenticated user.

- **Parameters:**
  - `accessToken`: The user's access token

- **Returns:** Promise resolving to a `CurrentUser` object

  ```typescript
  interface CurrentUser {
    id: string;
    email: string;
    name: string;
  }
  ```

- **Example:**
  ```typescript
  const user = await client.currentUser('user-access-token');
  ```

## Error Handling

The SDK methods throw errors when:

- The network request fails
- The authentication token is invalid
- The API key is invalid
- The server returns an error response

Example error handling:

```typescript
try {
  const user = await client.currentUser(accessToken);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    // Handle specific error cases
    console.error('Error:', error.message);
  }
}
```

## TypeScript Support

This package includes TypeScript type definitions. No additional `@types` packages are required.

## Contributing

Please read our [Contributing Guide](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
