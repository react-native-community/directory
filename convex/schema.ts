import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const LibrarySchema = v.object({
  alternatives: v.optional(v.array(v.string())),
  android: v.optional(v.boolean()),
  dev: v.optional(v.boolean()),
  example: v.optional(v.array(v.string())),
  examples: v.optional(v.array(v.string())),
  expo: v.optional(v.boolean()),
  expoGo: v.optional(v.boolean()),
  fireos: v.optional(v.boolean()),
  github: v.object({
    description: v.optional(v.string()),
    fullName: v.string(),
    hasTypes: v.boolean(),
    isArchived: v.boolean(),
    isPrivate: v.optional(v.boolean()),
    license: v.optional(
      v.union(
        v.null(),
        v.object({
          id: v.optional(v.string()),
          key: v.string(),
          name: v.string(),
          spdxId: v.string(),
          url: v.string(),
        })
      )
    ),
    name: v.string(),
    newArchitecture: v.optional(v.boolean()),
    registry: v.optional(v.string()),
    stats: v.object({
      createdAt: v.string(),
      forks: v.float64(),
      hasDiscussions: v.boolean(),
      hasIssues: v.boolean(),
      hasSponsorships: v.boolean(),
      hasTopics: v.optional(v.boolean()),
      hasWiki: v.boolean(),
      issues: v.float64(),
      pushedAt: v.string(),
      stars: v.float64(),
      subscribers: v.float64(),
      updatedAt: v.string(),
    }),
    topics: v.optional(v.array(v.string())),
    urls: v.object({
      homepage: v.union(v.null(), v.string()),
      repo: v.string(),
    }),
  }),
  githubUrl: v.string(),
  images: v.optional(v.array(v.string())),
  ios: v.optional(v.boolean()),
  macos: v.optional(v.boolean()),
  matchingScoreModifiers: v.array(v.string()),
  newArchitecture: v.optional(v.union(v.boolean(), v.literal('new-arch-only'))),
  newArchitectureNote: v.optional(v.string()),
  npm: v.object({
    downloads: v.optional(v.float64()),
    weekDownloads: v.optional(v.float64()),
  }),
  npmPkg: v.string(),
  popularity: v.float64(),
  score: v.float64(),
  template: v.optional(v.boolean()),
  topicSearchString: v.string(),
  tvos: v.optional(v.boolean()),
  unmaintained: v.optional(v.boolean()),
  visionos: v.optional(v.boolean()),
  web: v.optional(v.boolean()),
  windows: v.optional(v.boolean()),
});

export default defineSchema({
  libraries: defineTable(LibrarySchema).index('by_npmPkg', ['npmPkg']),
});
