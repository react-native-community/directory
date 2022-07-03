import cheerio from 'cheerio';
import fetch from 'cross-fetch';

import { sleep } from './build-and-score-data';

const isLikelyUsefulImage = (image, imageSrc, githubUrl) => {
  const parentHref = image.parent().attr('href');
  const isInHeader = image.parents('h1').length > 0;
  const isFromRepo = imageSrc.includes(githubUrl) || imageSrc.startsWith('/');
  const isAvatar = imageSrc.includes('avatars0.githubusercontent.com');
  const isBadge =
    imageSrc.includes('shields.io') ||
    imageSrc.includes('travis-ci.com') ||
    imageSrc.includes('badge.svg');

  return (
    (isFromRepo && !isInHeader && !isBadge && !isAvatar) ||
    (parentHref && imageSrc && parentHref === imageSrc && !isInHeader && !isBadge && !isAvatar)
  );
};

const scrapeImagesAsync = async githubUrl => {
  const response = await fetch(githubUrl);
  const html = await response.text();
  const $ = cheerio.load(html);
  const images = $('#readme').find('img');

  if (images && images.length) {
    const usefulImages = [];
    for (let i = 0; i <= images.length - 1; i++) {
      const image = $(images[i]);
      const imageSrc = image.attr('data-canonical-src') || image.attr('src');
      if (isLikelyUsefulImage(image, imageSrc, githubUrl)) {
        const finalURL = imageSrc.startsWith('/') ? `https://github.com${imageSrc}` : imageSrc;
        usefulImages.push(finalURL);
      }
    }
    return usefulImages;
  } else {
    return [];
  }
};

const fetchReadmeImages = async (data, attemptsCount = 0) => {
  /**
   * @DEV
   * if images been set, or max attempt count has been reached, we skip scraping images
   */
  if (data.images || attemptsCount > 5) {
    return data;
  }

  const { githubUrl } = data;

  try {
    const images = await scrapeImagesAsync(githubUrl);

    return {
      ...data,
      images,
    };
  } catch {
    console.log(`[GH] Retrying image scrape for ${githubUrl} (${attemptsCount + 1})`);
    await sleep(2000);
    return await fetchReadmeImages(data, attemptsCount + 1);
  }
};

export default fetchReadmeImages;
