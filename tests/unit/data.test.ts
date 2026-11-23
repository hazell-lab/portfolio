// checks on the real content, so a typo in the data fails the tests instead of the live site
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { experienceAreas, skillGroups, education } from '@/data/profile';
import { navigation, person, socials } from '@/data/site';

const slugs = new Set(projects.map((project) => project.slug));

describe('projects', () => {
  it('has unique, url safe slugs', () => {
    expect(slugs.size).toBe(projects.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('includes all nine projects', () => {
    expect([...slugs].sort()).toEqual(
      ['clipnest', 'hazcast', 'hazfocus', 'hazstore', 'islandbar', 'kite', 'streamix', 'wavemusic', 'yes-halal'].sort(),
    );
  });

  it('only links to https addresses', () => {
    for (const project of projects) {
      for (const href of Object.values(project.links)) expect(href).toMatch(/^https:\/\//);
    }
  });

  it('gives every image a description', () => {
    for (const project of projects) {
      expect(project.cover.alt.length, project.slug).toBeGreaterThan(10);
      for (const image of project.gallery?.images ?? []) expect(image.alt.length, project.slug).toBeGreaterThan(10);
    }
  });

  it('keeps the card figure in line with the test count', () => {
    for (const project of projects) {
      if (project.tests && project.figure) expect(project.figure.value, project.slug).toBe(String(project.tests.count));
    }
  });

  it('says how the work was split on team projects', () => {
    for (const project of projects.filter((item) => item.team)) {
      expect(project.team?.size).toBeGreaterThan(1);
      expect(project.team?.contribution.length).toBeGreaterThan(0);
    }
  });

  it('explains how to see a project that has no demo and no code link', () => {
    for (const project of projects.filter((item) => !item.links.demo && !item.links.code)) {
      expect(project.platformNote, project.slug).toBeTruthy();
    }
  });

  it('has the content every project page needs', () => {
    for (const project of projects) {
      expect(project.overview.length, project.slug).toBeGreaterThan(0);
      expect(project.testing.intro.length, project.slug).toBeGreaterThan(0);
      expect(project.learned.length, project.slug).toBeGreaterThan(0);
    }
  });
});

describe('links between sections', () => {
  it('skill groups only point at projects that exist', () => {
    for (const group of skillGroups)
      for (const item of group.items) for (const slug of item.projects ?? []) expect(slugs.has(slug), slug).toBe(true);
  });

  it('front-end skill groups come before the supporting ones', () => {
    const tiers = skillGroups.map((group) => group.tier);
    expect(tiers.indexOf('supporting')).toBeGreaterThan(tiers.lastIndexOf('core'));
  });

  it('experience areas only point at projects that exist', () => {
    for (const area of experienceAreas) for (const slug of area.projects) expect(slugs.has(slug), slug).toBe(true);
  });
});

describe('profile', () => {
  it('shows the diploma with the real cgpa', () => {
    expect(education[0]?.title).toMatch(/Software Engineering/);
    expect(education[0]?.badge.value).toBe('3.70');
  });

  it('uses the agreed title', () => {
    expect(person.title).toBe('Software Engineering Student / Aspiring Front-End Developer');
  });

  it('has a nav item for every home section and safe social links', () => {
    expect(navigation.map((item) => item.id)).toEqual(['home', 'about', 'skills', 'projects', 'education', 'experience', 'contact']);
    for (const social of socials) expect(social.href).toMatch(/^(https:\/\/|mailto:)/);
  });
});

describe('netlify redirects', () => {
  it('sends every old .html case study address to its project page', () => {
    const file = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
    const rules = file
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split(/\s+/));

    // a placeholder must be a whole path segment, or netlify redirects to the literal text
    for (const [from, to] of rules) expect(`${from} ${to}`).not.toMatch(/:[a-z]+\./);
    for (const slug of slugs) {
      expect(rules, slug).toContainEqual([`/projects/${slug}.html`, `/projects/${slug}/`, '301']);
    }
  });
});
