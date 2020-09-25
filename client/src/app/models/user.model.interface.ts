export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Context extends User {
  path: string;
}
