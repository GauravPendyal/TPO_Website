"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addStudent(formData: FormData) {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  if (!session || session.user.role !== "TPO_ADMIN" || !collegeId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;
  const gradYear = parseInt(formData.get("gradYear") as string, 10);

  await prisma.student.create({
    data: {
      name,
      email,
      department,
      gradYear,
      collegeId,
    },
  });

  revalidatePath("/tpo/students");
  redirect("/tpo/students");
}
