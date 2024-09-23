import { DocumentLocationResolver } from "sanity/presentation";
import { map } from "rxjs";

export const locate: DocumentLocationResolver = (params, context) => {
  if (params.type === "post") {
    const doc$ = context.documentStore.listenQuery(
      `*[_id == $id][0]{slug,title}`,
      params,
      { perspective: "previewDrafts" }
    );

    return doc$.pipe(
      map((doc) => {
        if (!doc || !doc.slug?.current) {
          return null;
        }
        return {
          locations: [
            {
              title: doc.title || "Untitled",
              href: `/${doc.slug.current}`,
            },
            {
              title: "Posts",
              href: "/",
            },
          ],
        };
      })
    );
  }
  return null;
};
