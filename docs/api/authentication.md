# Authentication API Documentation

VibeFinder uses a combination of Supabase authentication and wallet-based authentication through Coinbase's OnchainKit.

## Authentication Flow

1. **User connects wallet**: The user connects their wallet using the ConnectWallet component from OnchainKit.
2. **Wallet authentication**: OnchainKit handles the wallet authentication process.
3. **User creation/login**: Once the wallet is authenticated, the application checks if the user exists in the Supabase database. If not, a new user is created.
4. **Session management**: Supabase handles session management, including token generation and validation.

## Authentication Endpoints

### Check Authentication Status

```typescript
// Check if user is authenticated
async function isAuthenticated(): Promise<boolean>
```

**Description**: Checks if the current user is authenticated.

**Returns**: A boolean indicating whether the user is authenticated.

**Example Usage**:
```typescript
const authenticated = await isAuthenticated();
if (authenticated) {
  // User is authenticated
} else {
  // User is not authenticated
}
```

### Get Current User

```typescript
// Get current user
async function getCurrentUser(): Promise<User | null>
```

**Description**: Gets the current authenticated user.

**Returns**: The user object if authenticated, null otherwise.

**Example Usage**:
```typescript
const user = await getCurrentUser();
if (user) {
  console.log(`User ID: ${user.id}`);
  console.log(`User Email: ${user.email}`);
} else {
  console.log('No authenticated user');
}
```

### Sign Out

```typescript
// Sign out
async function signOut(): Promise<void>
```

**Description**: Signs out the current user.

**Returns**: A promise that resolves when the sign-out is complete.

**Example Usage**:
```typescript
await signOut();
console.log('User signed out');
```

## Wallet Authentication

VibeFinder uses Coinbase's OnchainKit for wallet authentication. The application provides components for connecting wallets and displaying user identity.

### ConnectWallet Component

```tsx
<ConnectWallet />
```

**Description**: Renders a button that allows users to connect their wallet.

**Example Usage**:
```tsx
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

function LoginPage() {
  return (
    <div>
      <h1>Connect Your Wallet</h1>
      <ConnectWallet />
    </div>
  );
}
```

### Identity Components

```tsx
<Identity>
  <Avatar />
  <Name />
</Identity>
```

**Description**: Renders the user's avatar and name based on their connected wallet.

**Example Usage**:
```tsx
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';

function UserProfile() {
  return (
    <div>
      <Identity>
        <Avatar />
        <Name />
      </Identity>
    </div>
  );
}
```

## Protected Routes

VibeFinder uses middleware to protect certain routes that require authentication. The middleware checks for an authentication token in the cookies and redirects unauthenticated users to the home page.

Protected routes include:
- `/subscription/*`: Subscription management pages
- `/onboarding/*`: User onboarding pages

## Error Handling

Authentication errors are handled gracefully with appropriate error messages displayed to the user. The application also provides fallback mechanisms for when authentication fails.

