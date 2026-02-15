// BookmarksContext for Wall Street Wildlife Mobile
// Provides shared bookmark state across the app
import React, { createContext, useContext, ReactNode } from 'react';
import { useBookmarksHook, BookmarksState } from '../hooks/useBookmarks';

const BookmarksContext = createContext<BookmarksState | null>(null);

interface BookmarksProviderProps {
  children: ReactNode;
}

export const BookmarksProvider: React.FC<BookmarksProviderProps> = ({ children }) => {
  const bookmarksState = useBookmarksHook();

  return (
    <BookmarksContext.Provider value={bookmarksState}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = (): BookmarksState => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

export default BookmarksContext;
