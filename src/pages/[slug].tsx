import { QueryParams, SanityDocument } from "next-sanity";
import dynamic from "next/dynamic";
import { GetStaticPaths } from "next";

import { getClient } from "../sanity/lib/client";
import { token } from "../sanity/lib/token";
import { POSTS_SLUG_QUERY, POST_QUERY } from "../sanity/lib/queries";
import Post from "@/components/Post";

const PostPreview = dynamic(() => import("@/components/PostPreview"));

type PageProps = {
  post: SanityDocument;
  params: QueryParams;
  draftMode: boolean;
  token: string;
};

export default function SinglePost(props: PageProps) {
  if (!props.post) {
    return <div>Loading...</div>;
  }

  return props.draftMode ? (
    <PostPreview post={props.post} params={props.params} />
  ) : (
    <Post post={props.post} />
  );
}

export const getStaticProps = async ({ params = {}, draftMode = false }) => {
  const client = getClient(draftMode ? token : undefined);
  const post = await client.fetch<SanityDocument>(POST_QUERY, params);

  return {
    props: {
      post,
      params,
      draftMode,
      token: draftMode ? token : "",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getClient().fetch(POSTS_SLUG_QUERY);

  return { paths, fallback: true };
};
