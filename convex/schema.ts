import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  board: defineTable({
    title: v.string(),
    organizationId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index("by_org", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["organizationId"],
    }),

  userFavorite: defineTable({
    organizationId: v.string(),
    userId: v.string(),
    boardId: v.id("board"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_organization", ["userId", "organizationId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_organization", [
      "userId",
      "boardId",
      "organizationId",
    ]),
});
