import {Role} from "./role.service";
import {Users} from "../../user/edit/users.service";

export interface RoleUser {
  id: number;
  users: Users;
  role: Role;
}

