import {Authority} from "../../authority/authority.service";
import {Role} from "./role.service";

export interface RoleData {
  id: number;
  authority: Authority;
  role: Role;
}

