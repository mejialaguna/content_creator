import { ChevronRight, ChevronLast, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

import { generatePaginationNumber } from '@/utils/generatePathUrl';

interface PaginationProps {
  contentCount: number | undefined;
  totalPages: number | undefined;
}

export function Pagination({ contentCount, totalPages }: PaginationProps) {
  const take = 5;
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPageString = useMemo(
    () => searchParams.get('page') ?? 1,
    [searchParams]
  );
  const currentPage = useMemo(
    () => (isNaN(+currentPageString) ? 1 : +currentPageString),
    [currentPageString]
  );

  const rightArrowClasses = useMemo(
    () =>
      // eslint-disable-next-line max-len
      'relative inline-flex items-center rounded-r-md px-2 bg-gray-50 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0 cursor-pointer',
    []
  );

  const leftArrowClasses = useMemo(
    () =>
      // eslint-disable-next-line max-len
      'relative inline-flex items-center rounded-l-md px-2 bg-gray-50 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0 cursor-pointer',
    []
  );

  const lastItemIndex = useMemo(
    () => Math.min(currentPage * take, contentCount ?? 0),
    [contentCount, currentPage, take]
  );

  const showingCurrentCount = useMemo(
    () => Math.min((currentPage - 1) * take + 1, contentCount ?? 0),
    [contentCount, currentPage, take]
  );

  if (currentPage < 1 || isNaN(+currentPageString)) {
    redirect(pathName);
  }

  const createPageUrl = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (pageNumber === '...') {
        return `${pathName}?${params.toString()}`;
      }

      if (+pageNumber <= 0) {
        return `${pathName}`;
      }

      if (totalPages && +pageNumber > totalPages) {
        return `${pathName}?${params.toString()}`;
      }

      params.set('page', pageNumber.toString());
      return `${pathName}?${params.toString()}`;
    },
    [pathName, searchParams, totalPages]
  );

  const allPages = generatePaginationNumber(currentPage, totalPages ?? 0);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{showingCurrentCount}</span> to{' '}
          <span className="font-medium">{lastItemIndex}</span> of{' '}
          <span className="font-medium">{contentCount}</span> results
        </p>
      </div>
      <div className={`${totalPages && totalPages > 1 ? 'flex' : 'hidden'}`}>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {currentPage === 1 ? (
            <span className={leftArrowClasses}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={createPageUrl(currentPage - 1)}
              className={leftArrowClasses}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
          {allPages.map((page) =>
            page === currentPage ? (
              <span
                key={`page-${page}`}
                aria-current="page"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                focus:z-20 focus:outline-offset-0 hover:bg-transparent transition-all duration-300 cursor-pointer ${
                  page === currentPage &&
                  'bg-blue-600 hover:bg-blue-400 text-white'
                }`}
              >
                {page}
              </span>
            ) : (
              <Link
                key={`page-${page}`}
                href={createPageUrl(page)}
                aria-current="page"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                focus:z-20 focus:outline-offset-0 hover:bg-transparent transition-all duration-300 ${
                  page === currentPage &&
                  'bg-blue-700 hover:bg-blue-500 text-white'
                }`}
              >
                {page}
              </Link>
            )
          )}
          {currentPage === totalPages ? (
            <span className={rightArrowClasses}>
              <ChevronLast className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={createPageUrl(currentPage + 1)}
              className={rightArrowClasses}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
