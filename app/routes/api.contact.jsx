import prisma from "../db.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";

  await prisma.contact.create({
    data: { name, email, message },
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
