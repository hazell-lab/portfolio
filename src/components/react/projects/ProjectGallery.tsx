// screenshot gallery on project pages. each image opens bigger in a modal, where the arrow
// buttons and keys step through the set. the expand buttons only appear once react runs,
// so without javascript there are no buttons that do nothing.
import { useCallback, useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';
import { Modal } from '../ui/Modal';
import { Icon } from '../ui/Icon';
import type { GalleryImage } from './types';

interface Props {
  images: GalleryImage[];
  projectName: string;
}

export function ProjectGallery({ images, projectName }: Props) {
  const isClient = useIsClient();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const count = images.length;
  const step = (by: number) => setOpenIndex((index) => (index === null ? null : (index + by + count) % count));
  const shown = openIndex === null ? undefined : images[openIndex];

  return (
    <>
      <div className={`case-gallery${count === 1 ? ' is-single' : ''}`}>
        {images.map((image, index) => (
          <figure
            key={image.src}
            className={`case-shot${image.frame === 'phone' ? ' is-phone' : ''}${image.frame === 'window' ? ' is-window' : ''}`}
          >
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes}
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {image.caption && <figcaption>{image.caption}</figcaption>}
            {isClient && (
              <button className="case-shot-expand" type="button" aria-haspopup="dialog" onClick={() => setOpenIndex(index)}>
                <Icon name="expand" />
                <span className="visually-hidden">
                  View screenshot {index + 1} of {count} of {projectName} larger
                </span>
              </button>
            )}
          </figure>
        ))}
      </div>

      {isClient && (
        <Modal open={openIndex !== null} onClose={close} labelledBy="lightbox-caption" className="lightbox">
          <div
            className="lightbox-inner"
            onKeyDown={(event) => {
              if (count < 2) return;
              if (event.key === 'ArrowRight') step(1);
              if (event.key === 'ArrowLeft') step(-1);
            }}
          >
            <div className="lightbox-bar">
              <p className="lightbox-count meta-key" aria-live="polite">
                {openIndex === null ? '' : `Screenshot ${openIndex + 1} of ${count}`}
              </p>
              <button className="lightbox-btn" type="button" onClick={close}>
                <Icon name="close" />
                <span className="visually-hidden">Close screenshot</span>
              </button>
            </div>
            <figure className="lightbox-figure">
              {shown && <img src={shown.large} alt={shown.alt} decoding="async" />}
              <figcaption id="lightbox-caption">{shown ? shown.caption || shown.alt : 'Screenshot'}</figcaption>
            </figure>
            {count > 1 && (
              <div className="lightbox-nav">
                <button className="lightbox-btn" type="button" onClick={() => step(-1)}>
                  <Icon name="arrow-left" />
                  <span className="visually-hidden">Previous screenshot</span>
                </button>
                <button className="lightbox-btn" type="button" onClick={() => step(1)}>
                  <Icon name="arrow-right" />
                  <span className="visually-hidden">Next screenshot</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
