import { del, list } from '@vercel/blob';

const BLOBS_LIMIT = 3;

async function deleteOutdatedBlobs() {
  const { blobs } = await list();

  const groupedBlobs = new Map<string, typeof blobs>();
  blobs.forEach(blob => {
    const group = blob.pathname.startsWith('dependants') ? 'dependants' : 'data';
    const groupBlobs = groupedBlobs.get(group) ?? [];
    groupBlobs.push(blob);
    groupedBlobs.set(group, groupBlobs);
  });

  const outdatedBlobs = [...groupedBlobs.values()].flatMap(groupBlobs => {
    const sortedBlobs = groupBlobs.toSorted(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    return sortedBlobs.slice(BLOBS_LIMIT);
  });

  if (outdatedBlobs.length) {
    await Promise.all(outdatedBlobs.map(blob => del(blob.pathname)));
    console.log('🗑️ All outdated blobs have been deleted.');
  } else {
    console.log('💬️ Blobs cleanup is not needed.');
  }
}

await deleteOutdatedBlobs();
