import { list, del } from '@vercel/blob';

const BLOBS_LIMIT = 3;

async function deleteOutdatedBlobs() {
  const { blobs } = await list();

  if (blobs?.length > BLOBS_LIMIT) {
    const sortedBlobs = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const outdatedBlobs = sortedBlobs.slice(BLOBS_LIMIT);

    await Promise.all(
      outdatedBlobs.map(async blob => {
        await del(blob.url);
      })
    );

    console.log('🗑️ All outdated blobs have been deleted.');
  } else {
    console.log('💬️ Blobs cleanup is not needed.');
  }
}

deleteOutdatedBlobs();
