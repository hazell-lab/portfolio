// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { readQueryParam, useQueryParam, writeQueryParam } from '@/hooks/useQueryParam';
import { useProjectFilter } from '@/hooks/useProjectFilter';

describe('useQueryParam', () => {
  it('reads and writes one value in the address bar without adding history entries', () => {
    const before = history.length;
    const { result } = renderHook(() => useQueryParam('q'));
    expect(result.current[0]).toBeNull();

    act(() => result.current[1]('hello'));
    expect(result.current[0]).toBe('hello');
    expect(readQueryParam('q')).toBe('hello');
    expect(history.length).toBe(before);

    act(() => result.current[1](null));
    expect(window.location.search).toBe('');
  });

  it('keeps every reader of the same key in sync', () => {
    const one = renderHook(() => useQueryParam('tab'));
    const two = renderHook(() => useQueryParam('tab'));
    act(() => writeQueryParam('tab', 'b'));
    expect(one.result.current[0]).toBe('b');
    expect(two.result.current[0]).toBe('b');
  });

  it('follows the back and forward buttons', () => {
    const { result } = renderHook(() => useQueryParam('page'));
    act(() => {
      history.pushState(null, '', '/?page=2');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current[0]).toBe('2');
  });
});

describe('useProjectFilter', () => {
  const list = [
    { slug: 'a', category: 'web' as const },
    { slug: 'b', category: 'web' as const },
    { slug: 'c', category: 'desktop' as const },
  ];

  it('works out the visible projects and the counts from the filter', () => {
    const { result } = renderHook(() => useProjectFilter(list));
    expect(result.current.filter).toBe('all');
    expect(result.current.counts).toEqual({ all: 3, web: 2, desktop: 1, mobile: 0 });

    act(() => result.current.setFilter('desktop'));
    expect(result.current.visible.map((project) => project.slug)).toEqual(['c']);
    expect(window.location.search).toBe('?filter=desktop');

    act(() => result.current.setFilter('all'));
    expect(result.current.visible).toHaveLength(3);
    expect(window.location.search).toBe('');
  });
});
