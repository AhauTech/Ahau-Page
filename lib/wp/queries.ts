export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      date
      modified
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        canonical
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;


export const GET_ALL_CATEGORY_SLUGS = `
  query GetAllCategorySlugs {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes {
        slug
      }
    }
  }
`;
export const GET_POSTS_FOR_HOME = `
  query GetPostsForHome($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        title
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($slug: ID!, $first: Int = 10, $after: String) {
    category(id: $slug, idType: SLUG) {
      name
      slug
      description
      seo {
        title
        metaDesc
      }
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          slug
          title
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;