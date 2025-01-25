export const appwriteConfig = {
  endpointUrl: process.env.APPWRITE_ENDPOINT!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  generalDatabaseId: process.env.APPWRITE_GENERAL_DATABASE_ID!,
  authenticationCollectionId:
    process.env.APPWRITE_AUTHENTICATION_COLLECTION_ID!,
  secretKey: process.env.APPWRITE_SECRET_API_KEY!,
  transcationDatabaseId: process.env.APPWRITE_TRANSCATIONDB_DATABASE_ID!,
  ordersCollectionId: process.env.APPWRITE_ORDERS_COLLECTION_ID!,
  scripsListCollectionId: process.env.APPWRITE_SCRIPS_LIST_COLLECTION_ID!,
};

export const envVariables = {
  homepageUrl: process.env.APP_HOMEPAGE_URL
}