'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useSetSearchQueryInURL = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQuery = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set(key, value.toString());

      const queryString = params.toString();
      const updatedPath = `${pathname}?${queryString}`;

      router.push(updatedPath, { scroll: false });
    },
    [searchParams, pathname, router],
  );
  const appendQuery = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.append(key, value.toString());

      const queryString = params.toString();
      const updatedPath = `${pathname}?${queryString}`;

      router.push(updatedPath, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const deleteQuery = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(key);

      const queryString = params.toString();
      const updatedPath = `${pathname}?${queryString}`;

      router.push(updatedPath, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setMultipleQueries = useCallback(
    (queries: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(queries).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      const queryString = params.toString();
      const updatedPath = `${pathname}${queryString ? `?${queryString}` : ''}`;

      router.push(updatedPath, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const getQueryObject = () => {
    return Object.fromEntries(
      Array.from(new Set([...searchParams.keys()])).map((key) => [
        key,
        searchParams.getAll(key).length > 1 ? searchParams.getAll(key) : searchParams.get(key),
      ]),
    );
  };

  return { setQuery, appendQuery, searchParams, deleteQuery, getQueryObject, setMultipleQueries };
};

export default useSetSearchQueryInURL;
