import { Library, LibraryWithConvexData } from '~/types';

import { query } from './_generated/server';

export const getLibrariesData = query({
  args: {},
  handler: async (ctx): Promise<Library[]> => {
    const librariesData: LibraryWithConvexData[] = await ctx.db.query('libraries').collect();
    return librariesData.map(entry => {
      const { _id, _creationTime, ...rest } = entry;
      return rest;
    });
  },
});
