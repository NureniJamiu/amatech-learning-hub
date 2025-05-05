import prisma from "@/lib/prisma";

export const isAdminUser = async (userId: string): Promise<boolean | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  return user?.isAdmin ?? null;
};
