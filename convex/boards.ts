import { v } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {
    organizationId: v.string(),
    search: v.optional(v.string()),
    favorite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const title = args.search;
    const favorite = args.favorite;
    let boardsQuery;
    if (title) {
      boardsQuery = ctx.db
        .query("board")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("organizationId", args.organizationId)
        )
        .collect();
    } else {
      boardsQuery = ctx.db
        .query("board")
        .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
        .order("desc")
        .collect();
    }
    const boards = await boardsQuery;

    const boardWithFavoritesPromise = boards.map(async (board) =>
      ctx.db
        .query("userFavorite")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => ({ ...board, isFavorite: !!favorite }))
    );

    let boardWithFavorites = await Promise.all(boardWithFavoritesPromise);
    if (favorite)
      boardWithFavorites = boardWithFavorites.filter(
        (board) => board.isFavorite
      );
    return boardWithFavorites;
  },
});
