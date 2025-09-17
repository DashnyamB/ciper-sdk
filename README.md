# Cipher Authentication SDKs

This monorepo contains official SDKs for interacting with the Cipher Authentication Service.

## Available Packages

| Package                                  | Description                                       | Version                                                                                                           |
| ---------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [@cipher-auth/server](./packages/server) | Server-side SDK for Cipher Authentication         | [![npm](https://img.shields.io/npm/v/@cipher-auth/server.svg)](https://www.npmjs.com/package/@cipher-auth/server) |
| [@cipher-auth/next](./packages/next)     | Next.js integration with Server Component support | [![npm](https://img.shields.io/npm/v/@cipher-auth/next.svg)](https://www.npmjs.com/package/@cipher-auth/next)     |

## Documentation

- [@cipher-auth/server documentation](./packages/server/README.md)

## Development

This repository uses Bun as the package manager. To get started:

```bash
# Clone the repository
git clone https://github.com/DashnyamB/ciper-sdk.git
cd ciper-sdk

# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
