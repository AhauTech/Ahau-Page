const WP_API_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

if (!WP_API_URL) {
  throw new Error("Missing NEXT_PUBLIC_WP_GRAPHQL_URL environment variable");
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function wpFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = 3600
): Promise<T> {
  const res = await fetch(WP_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join(", ");
    throw new Error(`GraphQL errors: ${messages}`);
  }

  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }

  return json.data;
}
