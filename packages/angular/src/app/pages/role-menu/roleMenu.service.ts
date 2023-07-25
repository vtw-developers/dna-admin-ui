import {Role} from "../role/edit/role.service";
import {Menu} from "../menu/menu.service";

export interface RoleMenu {
  id: number;
  menu: Menu;
  role: Role;
}
