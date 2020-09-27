export interface File {
  _id: string;
  id: string;
  shared_user_ids: [string];
  name: string;
  original_file_name: string;
  original_file_id: string;
  description: string;
  path: string;
  type: string;
  user_id: string;
}
