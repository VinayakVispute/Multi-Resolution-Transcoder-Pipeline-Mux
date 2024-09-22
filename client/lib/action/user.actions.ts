"use server";
import prisma from "@/lib/prisma";

export const checkUserAPIKey = async (userId: string) => {
  // Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      apiKey: true,
    },
  });

  // If user not found, or they don't have an API key set
  if (!user || !user.apiKey) {
    return {
      success: false,
      data: null,
    };
  }

  // If user has an API key set, return true
  return {
    success: true,
    data: user.apiKey,
  };
};
