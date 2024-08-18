import { v } from "convex/values";

import { mutation } from "./_generated/server";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
];

export const create = mutation({
  args: {
    organizationId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("board", {
      title: args.title,
      organizationId: args.organizationId,
      imageUrl: randomImage,
      authorId: identity.subject,
      authorName: identity.name!,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("board"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const title = args.title.trim();
    if (!title) throw new Error("Title is required");

    if (title.length > 60)
      throw new Error("Title cannot exceed be longer than 60 characters");

    const board = await ctx.db.patch(args.id, { title });

    return board;
  },
});
