import { NextRequest } from "next/server";




interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: URLSearchParams
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } =await params;

    const token = "x"

  if (!token) {
    return <div>Missing session token</div>;
  }

  return <div>Event room : {id}</div>;
}

