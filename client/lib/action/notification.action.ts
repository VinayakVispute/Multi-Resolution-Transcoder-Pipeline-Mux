"use server";
import prisma from "@/lib/prisma";
import { EventStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createNotification = async ({
  uploadedVideoId,
  userId,
  eventStatus,
}: {
  uploadedVideoId: string;
  userId: string;
  eventStatus: EventStatus;
}) => {
  const newCreatedNotification = await prisma.notifications.create({
    data: {
      userId: userId,
      uploadedVideoId: uploadedVideoId,
      event: eventStatus,
    },
  });
  if (!newCreatedNotification) {
    console.error("Failed to create new notification");
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to create new notification",
      })
    );
  }
  await revalidatePath("/Dashboard");
  return JSON.parse(
    JSON.stringify({
      success: true,
      data: newCreatedNotification,
    })
  );
};
