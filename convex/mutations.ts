import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { LibrarySchema } from './schema';

export const updateLibrariesData = mutation({
  args: {
    libraries: v.array(LibrarySchema),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('libraries').collect();
    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }

    let inserted = 0;
    for (const item of args.libraries) {
      await ctx.db.insert('libraries', item);
      inserted++;
    }

    return { deleted: existing.length, inserted };
  },
});
