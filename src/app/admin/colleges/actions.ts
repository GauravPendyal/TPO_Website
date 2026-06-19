"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addCollege(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const university = formData.get("university") as string;
  const partnershipType = formData.get("partnershipType") as string;
  const revenueSharePercentage = parseFloat(formData.get("revenueSharePercentage") as string);

  await prisma.college.create({
    data: {
      name,
      university,
      partnershipType,
      revenueSharePercentage,
      status: "APPROVED",
    },
  });

  revalidatePath("/admin/colleges");
  redirect("/admin/colleges");
}
