"use server";

import { z } from "zod";
import { buySellFormSchema } from "@/lib/zod-auth-schema";
import { ScripStatus } from "@/components/buy-sell/popover-search";
import { createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { getLoggedInUser } from "../actions/user.actions";

export const submitScripBuySell = async (
  values: z.infer<typeof buySellFormSchema>,
  selectedStatus: ScripStatus | null
) => {
  try {
    const validatedFields = buySellFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid Fields.",
        },
      };
    }

    if (selectedStatus == null) {
      return {
        success: false,
        error: {
          message: "No scrip selected. Please select a scrip.",
          statusCode: 500,
          cause: "SELECTED_SCRIP_NULL",
        },
      };
    }

    const { databases } = await createSessionClient();

    const { documents: scrips } = await databases.listDocuments(
      appwriteConfig.transcationDatabaseId,
      appwriteConfig.scripsListCollectionId,
      [Query.equal("$id", selectedStatus.id)]
    );

    if (scrips.length !== 1) {
      return {
        success: false,
        error: {
          message: "No scrip selected. Please select a scrip.",
          statusCode: 500,
          cause: "SELECTED_SCRIP_NULL",
        },
      };
    }

    const user = await getLoggedInUser().then((user) => user?.user);

    if (!user) new Error("User not found");

    const { documents: order } = await databases.createDocument(
      appwriteConfig.transcationDatabaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      {
        userId: user?.$id,
        scripId: scrips[0].$id,
        action: validatedFields.data.action === 0 ? "sell" : "buy",
        quantity: validatedFields.data.quantity as number,
        price: validatedFields.data.price as number,
        status: "open",
      }
    );

    return {
      success: true,
      scrips,
      data: validatedFields.data,
      selectedStatus,
      user,
    };
  } catch (error) {
    if (error)
      return {
        success: false,
        error: {
          message: "An error occurred while submitting scrips.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};

export const searchSelectedScrip = async (
  selectedStatus: ScripStatus | null
) => {
  try {
    if (selectedStatus == null) {
      return {
        success: false,
        error: {
          message: "No scrip selected. Please select a scrip.",
          statusCode: 500,
          cause: "SELECTED_SCRIP_NULL",
        },
      };
    }

    const { databases } = await createSessionClient();

    const { documents: scrips } = await databases.listDocuments(
      appwriteConfig.transcationDatabaseId,
      appwriteConfig.scripsListCollectionId,
      [Query.equal("$id", selectedStatus.id)]
    );

    if (scrips.length !== 1) {
      return {
        success: false,
        error: {
          message: "No scrip selected. Please select a scrip.",
          statusCode: 500,
          cause: "SELECTED_SCRIP_NULL",
        },
      };
    }

    return {
      success: true,
      scrips,
      data: scrips.map(({ scripName, $id, currentPrice }) => ({
        value: scripName,
        id: $id,
        currentPrice,
      })),
    };
  } catch (error) {
    if (error)
      return {
        success: false,
        error: {
          message: "An error occurred while submitting scrips.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};
