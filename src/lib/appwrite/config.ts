export const appwriteConfig = {
  endpointUrl: process.env.APPWRITE_ENDPOINT!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  generalDatabaseId: process.env.APPWRITE_GENERAL_DATABASE_ID!,
  authenticationCollectionId: process.env.APPWRITE_AUTHENTICATION_COLLECTION_ID!,
  secretKey: process.env.APPWRITE_SECRET_API_KEY!,
};
