import { Account, Client, Databases, ID, Models, OAuthProvider } from "appwrite";

let appwriteClient: Client | null = null;
let appwriteAccount: Account | null = null;
let appwriteDatabases: Databases | null = null;

function initializeAppwrite() {
  if (appwriteClient) return { appwriteClient, appwriteAccount, appwriteDatabases };

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";

  if (!endpoint || !projectId) {
    console.warn(
      "⚠ Appwrite environment variables not configured. Skipping initialization."
    );
    return { appwriteClient: null, appwriteAccount: null, appwriteDatabases: null };
  }

  appwriteClient = new Client();
  appwriteClient.setEndpoint(endpoint).setProject(projectId);

  appwriteAccount = new Account(appwriteClient);
  appwriteDatabases = new Databases(appwriteClient);

  return { appwriteClient, appwriteAccount, appwriteDatabases };
}

export const getAppwriteClient = (): Client | null => {
  const { appwriteClient: client } = initializeAppwrite();
  return client;
};

export const getAppwriteAccount = (): Account | null => {
  const { appwriteAccount: account } = initializeAppwrite();
  return account;
};

export const getAppwriteDatabases = (): Databases | null => {
  const { appwriteDatabases: databases } = initializeAppwrite();
  return databases;
};

export const appwriteConfig = {
  getEndpoint: () => process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  getProjectId: () => process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
};

/**
 * OAuth2 Google login helper
 */
export async function loginWithGoogle(successUrl?: string, failureUrl?: string): Promise<void> {
  const account = getAppwriteAccount();
  if (!account) throw new Error("Appwrite not initialized");

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const success = successUrl ?? `${origin}/dashboard`;
  const failure = failureUrl ?? `${origin}/signin`;

  // Redirects the user to Google's OAuth flow
  // Use the OAuthProvider enum for strict typing
   
  return (account.createOAuth2Session as any)(OAuthProvider.Google, success, failure) as Promise<void>;
}

/**
 * Create a phone token/session for SMS OTP flows.
 * The Appwrite SDK surface differs between versions; use the raw account methods if needed.
 */
export async function createPhoneSession(userId: string, phone: string): Promise<any> {
  const account = getAppwriteAccount();
  if (!account) throw new Error("Appwrite not initialized");

  // Use ID helper to generate a unique identifier when creating a phone token
  const id = userId || ID.unique();

  // Some SDKs expose createPhoneToken; call dynamically to avoid types errors
  // This will request that Appwrite send an OTP to the provided phone number
   
  const anyAccount: any = account as any;
  if (typeof anyAccount.createPhoneToken === "function") {
    return anyAccount.createPhoneToken(id, phone);
  }

  // Fallback: try createPhoneSession if available
  if (typeof anyAccount.createPhoneSession === "function") {
    return anyAccount.createPhoneSession(phone);
  }

  throw new Error("Phone session creation not supported by Appwrite SDK in this environment");
}

/**
 * Verify an OTP / secret for a phone flow by creating a session with the phone ID and secret
 */
export async function verifyPhoneOTP(userId: string, secret: string): Promise<Models.Session | any> {
  const account = getAppwriteAccount();
  if (!account) throw new Error("Appwrite not initialized");

  // Appwrite allows creating a session by ID + secret for phone-based flows
  return account.createSession(userId, secret);
}

/**
 * Register a new user account
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<Models.User<Models.Preferences>> {
  try {
    const account = getAppwriteAccount();
    if (!account) throw new Error("Appwrite not initialized");

    // Create the account
    await account.create("unique()", email, password, name);

    // Auto sign in after registration
    try {
      await account.createEmailPasswordSession(email, password);
    } catch (err) {
      // If session creation fails, continue — user may still be created
    }

    // Get the user
    const user = await account.get();
    return user;
  } catch (error) {
    // Provide clearer error when backend is unreachable
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.error("Registration error: Appwrite endpoint unreachable", error);
      throw new Error("Appwrite endpoint unreachable. Check NEXT_PUBLIC_APPWRITE_ENDPOINT");
    }

    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<Models.User<Models.Preferences> | null> {
  try {
    const account = getAppwriteAccount();
    if (!account) throw new Error("Appwrite not initialized");

    // If a session is already active, `account.get()` will succeed and we can
    // immediately return the user (no need to create a new session).
    try {
      const existing = await account.get();
      if (existing) {
        return existing as Models.User<Models.Preferences>;
      }
    } catch (e) {
      // Not authenticated / no valid session — continue to create a session
    }

    // Best-effort: delete any active session that might block creating a new one.
    try {
      await account.deleteSession("current");
    } catch (e) {
      // ignore deletion errors
    }

    // Try to create a new session. If Appwrite complains that a session is
    // active, attempt to delete the current session and retry once.
    try {
      await account.createEmailPasswordSession(email, password);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (
        msg.includes("Creation of a session is prohibited") ||
        msg.includes("session is active") ||
        msg.includes("prohibited when a session is active")
      ) {
        try {
          await account.deleteSession("current");
        } catch (e) {
          // ignore
        }

        // Retry creating the session once more
        await account.createEmailPasswordSession(email, password);
      } else {
        throw err;
      }
    }

    // Return the authenticated user
    const user = await account.get();
    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Appwrite endpoint unreachable. Check NEXT_PUBLIC_APPWRITE_ENDPOINT");
    }

    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  try {
    const account = getAppwriteAccount();
    if (!account) throw new Error("Appwrite not initialized");

    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get the current user
 */
export async function getUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const account = getAppwriteAccount();
    if (!account) return null;

    const user = await account.get();
    return user;
  } catch {
    // User is not logged in
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Ping the Appwrite backend to verify connection
 */
export async function pingAppwrite(): Promise<boolean> {
  try {
    const endpoint = appwriteConfig.getEndpoint();
    const projectId = appwriteConfig.getProjectId();

    if (!endpoint || !projectId) {
      console.error(
        "✗ Appwrite connection failed: Missing endpoint or project ID"
      );
      return false;
    }

    // Make actual HTTP request to Appwrite backend to verify connection
    const response = await fetch(`${endpoint}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("✓ Appwrite connection verified");
      return true;
    } else {
      // Treat 401 as a valid connection — the backend is reachable but the current
      // request is not authenticated (guest). This can happen when trying to
      // fetch account info with no session cookie. Consider the backend reachable.
      if (response.status === 401) {
        console.warn(
          "! Appwrite reachable but request unauthenticated (401). Treating as connected."
        );
        return true;
      }

      console.error("✗ Appwrite connection failed: Backend returned", response.status);
      return false;
    }
  } catch (error) {
    console.error("✗ Appwrite connection failed:", error);
    return false;
  }
}
