import { Injectable } from '@angular/core';

/** Stores data in the user's browser. */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /** Stores the data (state) using the given key. */
  setSavedState(state: any, localStorageKey: string) {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }

  /** Returns stored content using the given key. */
  getSavedState(localStorageKey: string): any {
    const state = localStorage.getItem(localStorageKey);
    return state !== null && state !== undefined
      ? JSON.parse(state)
      : undefined;
  }

  /** Erases the content saved using the given key. */
  removeSavedState(localStorageKey: string): any {
    return localStorage.removeItem(localStorageKey);
  }
}
