import { getAccessItemHierarchy } from "./get-access-item-hierarchy";

interface Permission {
  type: string;
  path?: string;
  parent_path?: string;
  hierarchy_id?: number;
  icon?: string;
  [key: string]: any;
}

interface FormattedPermissions {
  hierarchialMenus: any[];
  uis: Permission[];
  apis: Permission[];
}

const formatMyPermission = (permissions: Permission[]): FormattedPermissions => {
  const menuList = ["menu", "menu-screen"];
  const menus = permissions.filter(p => menuList.includes(p.type));
  const hierarchialMenus = getAccessItemHierarchy(menus as any);
  const uis = permissions.filter(p => p.type !== "api");
  const apis = permissions.filter(p => p.type === "api");

  return {
    hierarchialMenus,
    uis,
    apis
  };
};

export { formatMyPermission };

