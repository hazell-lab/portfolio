// turns an image from src/assets into plain urls that a react island can use.
// the files are still optimised by astro at build time, react only gets the result.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveImageData {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
}

export async function responsiveImage(
  source: ImageMetadata,
  options: { alt: string; widths: number[]; sizes: string },
): Promise<ResponsiveImageData> {
  // never ask for a copy wider than the original
  const widths = options.widths.filter((width) => width <= source.width);
  const result = await getImage({
    src: source,
    widths: widths.length > 0 ? widths : [source.width],
    sizes: options.sizes,
    format: 'webp',
  });
  return {
    src: result.src,
    srcSet: result.srcSet.attribute,
    sizes: options.sizes,
    width: source.width,
    height: source.height,
    alt: options.alt,
  };
}
