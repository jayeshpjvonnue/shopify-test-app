import prisma from "../db.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed");
  }

  const formData = await request.formData();
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";

  await prisma.contact.create({
    data: { name, email, message },
  });

  return new Response(
    JSON.stringify({ success: true, message: "Message sent!" }),
    { headers: { "Content-Type": "application/json" } }
  );
};
