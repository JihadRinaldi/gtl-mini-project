export const isFieldDirty = (oldField: string, newField: string): boolean => {
  return oldField !== newField;
};

export const areArraysEqual = (arr1: any[], arr2: any[]): boolean  => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};
