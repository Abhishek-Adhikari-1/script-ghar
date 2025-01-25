"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";

export const getAllScrips = async () => {
  try {
    const { databases } = await createSessionClient();

    const { documents: scrips } = await databases.listDocuments(
      appwriteConfig.transcationDatabaseId,
      appwriteConfig.scripsListCollectionId,
      [Query.limit(100), Query.orderAsc("scripName")]
    );

    return {
      success: true,
      //   total,
      //   scrips,
      data: scrips.map(({ scripName, $id }) => ({
        value: scripName,
        label: scripName,
        id: $id,
      })),
    };
  } catch (error) {
    if (error)
      return {
        success: false,
        error: {
          message: "An error occurred while getting scrips.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};

const setAllScrips = async () => {
  try {
    const allAScrips = [
      {
        scripName: "BLC (Best Finance Company Limited)",
        currentPrice: 854.32,
      },
      {
        scripName: "AKPL (Arun Kabeli Power Limited)",
        currentPrice: 854.32,
      },
      {
        scripName: "BPCL (Butwal Power Company Limited)",
        currentPrice: 678.45,
      },
      {
        scripName: "CHCL (Chilime Hydropower Company Limited)",
        currentPrice: 945.67,
      },
      {
        scripName: "JBBL (Jyoti Bikas Bank Limited)",
        currentPrice: 321.45,
      },
      {
        scripName: "LBL (Lumbini Bikas Bank Limited)",
        currentPrice: 543.21,
      },
      {
        scripName: "NLG (NLG Insurance Company Limited)",
        currentPrice: 756.78,
      },
      {
        scripName: "RADHI (Radhi Bidyut Company Limited)",
        currentPrice: 678.9,
      },
      {
        scripName: "PMHL (Panchakanya Mai Hydropower Limited)",
        currentPrice: 345.67,
      },
      {
        scripName: "SLICL (Surya Life Insurance Company Limited)",
        currentPrice: 923.45,
      },
      {
        scripName: "UPCL (Upper Tamakoshi Hydropower Limited)",
        currentPrice: 876.54,
      },
      {
        scripName: "WOMI (Womi Microfinance Bittiya Sanstha Limited)",
        currentPrice: 432.12,
      },
      {
        scripName: "BARUN (Barun Hydropower Company Limited)",
        currentPrice: 654.78,
      },
      {
        scripName: "GLH (Gurans Life Insurance Company Limited)",
        currentPrice: 789.34,
      },
      {
        scripName: "NABBC (Nepal Agriculture Bank Limited)",
        currentPrice: 567.89,
      },
      {
        scripName: "RHPL (Ridi Hydropower Company Limited)",
        currentPrice: 345.23,
      },
      {
        scripName: "UMRH (United Hydropower Limited)",
        currentPrice: 654.12,
      },
      {
        scripName: "MAHAL (Mahalaxmi Bikas Bank Limited)",
        currentPrice: 432.89,
      },
      {
        scripName: "SBBL (Siddhartha Bank Limited)",
        currentPrice: 890.34,
      },
      {
        scripName: "NHPC (Nepal Hydro and Electric Limited)",
        currentPrice: 543.67,
      },
      {
        scripName: "SLBS (Shangrila Development Bank Limited)",
        currentPrice: 321.89,
      },
      {
        scripName: "GHCL (Ghalemdi Hydropower Limited)",
        currentPrice: 789.65,
      },
      {
        scripName: "PRIN (Prime Life Insurance Company Limited)",
        currentPrice: 654.23,
      },
      {
        scripName:
          "NESDO (NESDO Sambridha Microfinance Bittiya Sanstha Limited)",
        currentPrice: 432.1,
      },
      {
        scripName: "NCC (Nepal Credit and Commerce Bank Limited)",
        currentPrice: 345.56,
      },
      {
        scripName: "IGI (IME General Insurance Limited)",
        currentPrice: 987.43,
      },
      {
        scripName: "MEGA (Mega Hydropower Limited)",
        currentPrice: 876.34,
      },
      {
        scripName: "BHPL (Bhote Koshi Power Company Limited)",
        currentPrice: 765.12,
      },
      {
        scripName: "PFL (Progressive Finance Limited)",
        currentPrice: 543.98,
      },
      {
        scripName: "CHDC (Chandragiri Hills Limited)",
        currentPrice: 678.45,
      },
      {
        scripName: "SJCL (Swabhiman Laghubitta Bittiya Sanstha Limited)",
        currentPrice: 456.78,
      },
    ];
    const { databases } = await createAdminClient();

    // await databases.createDocument(
    //   appwriteConfig.transcationDatabaseId,
    //   appwriteConfig.scripsListCollectionId,
    //   ID.unique(),
    //   allAScrips
    // );

    for (const scrip of allAScrips) {
      const { documents: isScripExists, total } = await databases.listDocuments(
        appwriteConfig.transcationDatabaseId,
        appwriteConfig.scripsListCollectionId,
        [Query.equal("scripName", scrip.scripName)]
      );

      if (total === 0) {
        await databases.createDocument(
          appwriteConfig.transcationDatabaseId, // Database ID
          appwriteConfig.scripsListCollectionId, // Collection ID
          ID.unique(), // Unique ID for the document
          scrip // Document data (single scrip)
        );
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error setting scrips:", error);
    if (error)
      return {
        success: false,
        error: {
          message: "An error occurred while setting scrips.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};
