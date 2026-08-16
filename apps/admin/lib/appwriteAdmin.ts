import { Client, Databases, Account } from 'appwrite';

let adminClient: Client | null = null;
let adminDatabases: Databases | null = null;
let adminAccount: Account | null = null;

function initAdminAppwrite() {
  if (adminClient) return { adminClient, adminDatabases, adminAccount };
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';
  if (!endpoint || !projectId) {
    console.warn('Appwrite not configured for admin');
    return { adminClient: null, adminDatabases: null, adminAccount: null };
  }
  adminClient = new Client();
  adminClient.setEndpoint(endpoint).setProject(projectId);
  adminDatabases = new Databases(adminClient);
  adminAccount = new Account(adminClient);
  return { adminClient, adminDatabases, adminAccount };
}

export const getAdminDatabases = (): Databases | null => {
  const { adminDatabases: db } = initAdminAppwrite();
  return db;
};

export const getAdminAccount = (): Account | null => {
  const { adminAccount: acc } = initAdminAppwrite();
  return acc;
};
