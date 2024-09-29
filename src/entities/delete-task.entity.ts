export type DeleteTaskBody = {
  type: 'active' | 'done';
  id: string;
};
