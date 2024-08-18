import { v } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const boards = await ctx.db
      .query("board")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();

    const boardWithFavoritesPromise = boards.map(async (board) =>
      ctx.db
        .query("userFavorite")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => ({ ...board, isFavorite: !!favorite }))
    );

    const boardWithFavorites = await Promise.all(boardWithFavoritesPromise);

    return boardWithFavorites;
  },
});
