import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

export const loader = async () => {
  const submissions = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify({ submissions }), {
    headers: { "Content-Type": "application/json" },
  });
};

export default function Dashboard() {
  const { submissions } = useLoaderData();

  return (
    <div style={{ padding: 20 }}>
      <h1>Form Submissions</h1>
      <ul>
        {submissions.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> ({s.email}): {s.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
