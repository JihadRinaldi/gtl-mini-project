import { APP_FAVORITE_KEY } from "./constants";

export const isFieldDirty = (oldField: string, newField: string): boolean => {
  return oldField !== newField;
};

export const areArraysEqual = (arr1: any[], arr2: any[]): boolean  => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};


export const saveFavoriteToLocalStorage = (contactId: number) => {
  const favoriteContactList = localStorage.getItem(APP_FAVORITE_KEY);
  if (favoriteContactList) {
    const newFavoriteList = [...JSON.parse(favoriteContactList), contactId];
    localStorage.setItem(APP_FAVORITE_KEY, JSON.stringify(newFavoriteList));
    return newFavoriteList;
  }   
    const favoriteList = [contactId];
    localStorage.setItem(APP_FAVORITE_KEY, JSON.stringify(favoriteList));
    return favoriteList;
};

export const arrayReOrder = (arrayInput: any[], order: any[], key: string) => {
  return arrayInput.sort((a, b) => {
    if (order.includes(a[key])) {
      return -1;
    }
    if (order.includes(b[key])) {
      return 1;
    }
    return 0;
  });
};