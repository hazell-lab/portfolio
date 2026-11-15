// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectGallery } from '@/components/react/projects/ProjectGallery';
import type { GalleryImage } from '@/components/react/projects/types';

const shot = (n: number): GalleryImage => ({
  src: `/s${n}.webp`,
  srcSet: `/s${n}.webp 800w`,
  sizes: '800px',
  width: 800,
  height: 500,
  alt: `Screen ${n}`,
  large: `/s${n}-large.webp`,
  caption: `Caption ${n}`,
  frame: 'wide',
});

const images = [shot(1), shot(2), shot(3)];

describe('ProjectGallery', () => {
  it('shows every screenshot with its alt text and caption', () => {
    render(<ProjectGallery images={images} projectName="Demo" />);
    expect(screen.getByAltText('Screen 1')).toBeInTheDocument();
    expect(screen.getByText('Caption 3')).toBeInTheDocument();
  });

  it('opens a screenshot larger, steps with buttons and arrow keys, and closes again', async () => {
    const user = userEvent.setup();
    render(<ProjectGallery images={images} projectName="Demo" />);

    const opener = screen.getByRole('button', { name: 'View screenshot 2 of 3 of Demo larger' });
    await user.click(opener);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByText('Screenshot 2 of 3')).toBeInTheDocument();
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/s2-large.webp');

    await user.click(within(dialog).getByRole('button', { name: 'Next screenshot' }));
    expect(within(dialog).getByText('Screenshot 3 of 3')).toBeInTheDocument();

    // it wraps around from the last screenshot to the first
    await user.click(within(dialog).getByRole('button', { name: 'Next screenshot' }));
    expect(within(dialog).getByText('Screenshot 1 of 3')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(within(dialog).getByText('Screenshot 3 of 3')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Close screenshot' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
    expect(opener).toHaveFocus();
  });

  it('has no step buttons for a single screenshot', async () => {
    const user = userEvent.setup();
    render(<ProjectGallery images={[shot(1)]} projectName="Demo" />);
    await user.click(screen.getByRole('button', { name: /view screenshot 1 of 1/i }));
    expect(screen.queryByRole('button', { name: 'Next screenshot' })).not.toBeInTheDocument();
  });
});
