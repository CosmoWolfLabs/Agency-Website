import { Account, Client, Databases, Models } from "appwrite";

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

export const getAppwriteClient = () => {
  const { appwriteClient: client } = initializeAppwrite();
  return client;
};

export const getAppwriteAccount = () => {
  const { appwriteAccount: account } = initializeAppwrite();
  return account;
};

export const getAppwriteDatabases = () => {
  const { appwriteDatabases: databases } = initializeAppwrite();
  return databases;
};

export const appwriteConfig = {
  getEndpoint: () => process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  getProjectId: () => process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
};

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
    await account.createEmailPasswordSession(email, password);

    // Get the user
    const user = await account.get();
    return user;
  } catch (error) {
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
): Promise<Models.Session> {
  try {
    const account = getAppwriteAccount();
    if (!account) throw new Error("Appwrite not initialized");

    const session = await account.createEmailPasswordSession(
      email,
      password
    );
    return session;
  } catch (error) {
    console.error("Login error:", error);
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
      console.error("✗ Appwrite connection failed: Backend returned", response.status);
      return false;
    }
  } catch (error) {
    console.error("✗ Appwrite connection failed:", error);
    return false;
  }
}
