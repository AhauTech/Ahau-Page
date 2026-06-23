import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// WordPress sends a POST to this endpoint after publishing/updating content.
// Configure the secret in WP (WPGraphQL Webhooks or custom plugin).
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (!REVALIDATION_SECRET || secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: { slug?: string; type?: "post" | "page" | "category" };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, type = "post" } = body;

  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });
  }

  try {
    if (type === "post") {
      revalidatePath(`/${slug}`);
      revalidatePath("/");
    } else if (type === "page") {
      revalidatePath(`/${slug}`);
    } else if (type === "category") {
      revalidatePath(`/categoria/${slug}`);
      revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, slug, type });
  } catch (err) {
    return NextResponse.json(
      { message: "Revalidation failed", error: String(err) },
      { status: 500 }
    );
  }
}
