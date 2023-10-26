import {Users} from "../user/edit/users.service";

export interface Block {
  id: string;
  users: Users;
  registerDate: Date;
  blockJson: string;
  data: string;
  dataName: string;
  dataDetail: string;
  pythonData: string;
  pythonToJs: string;
  comment: string;
  finished: Boolean;
  finishDate: Date;
  used: Boolean;
}
