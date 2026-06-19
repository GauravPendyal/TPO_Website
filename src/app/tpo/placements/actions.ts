"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addPlacement(formData: FormData) {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  if (!session || session.user.role !== "TPO_ADMIN" || !collegeId) {
    throw new Error("Unauthorized");
  }

  const studentId = formData.get("studentId") as string;
  const companyName = formData.get("companyName") as string;
  const role = formData.get("role") as string;
  const salaryStr = formData.get("salary") as string;
  const salary = salaryStr ? parseFloat(salaryStr) : null;
  const dateOffered = new Date(formData.get("dateOffered") as string);

  // Validate student belongs to college
  const student = await prisma.student.findUnique({
    where: { id: studentId, collegeId },
  });

  if (!student) {
    throw new Error("Invalid student");
  }

  await prisma.placement.create({
    data: {
      studentId,
      companyName,
      role,
      salary,
      dateOffered,
    },
  });

  revalidatePath("/tpo/placements");
  revalidatePath("/tpo/finance"); // Revenue might change
  redirect("/tpo/placements");
}
