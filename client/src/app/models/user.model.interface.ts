export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface Context extends User {
  path: string;
}
