import prisma from "../db.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const message = formData.get("message") || "";

    const contact = await prisma.contact.create({
      data: { name, email, message },
    });

    const [firstName, ...lastParts] = name.trim().split(" ");
    const lastName = lastParts.length ? lastParts.join(" ") : "Unknown";

    let shopifyCustomer = null;
    try {
      const shopifyRes = await fetch(
        `https://${process.env.SHOPIFY_SHOP}/admin/api/2024-04/customers.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN,
          },
          body: JSON.stringify({
            customer: {
              first_name: firstName,
              last_name: lastName,
              email,
            },
          }),
        }
      );

      const shopifyData = await shopifyRes.json();

      if (!shopifyRes.ok) {
        console.error("Shopify API error:", shopifyData);
      } else {
        shopifyCustomer = shopifyData.customer;
      }
    } catch (shopifyErr) {
      console.error("Shopify API call failed:", shopifyErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        contact,
        shopifyCustomer,
        message: shopifyCustomer ? "Message saved & Shopify customer created!" : "Message saved, Shopify customer not created.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error in /contact-action:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
