interface AccessItem {
  path: string;
  parent_path?: string;
  hierarchy_id: number;
  icon?: string;
  [key: string]: any;
}

interface FormattedAccessItem {
  [key: string]: any;
  subMenus: Omit<AccessItem, 'parent_path' | 'hierarchy_id' | 'icon'>[];
}

const getAccessItemHierarchy = (items: AccessItem[]): FormattedAccessItem[] => {
  if (!items || items.length <= 0) return [];

  const parents = items.filter(item => !item.parent_path);
  const children = items.filter(item => item.parent_path);

  const sortedParents = parents.sort((a, b) => a.hierarchy_id - b.hierarchy_id);
  const sortedChildren = children.sort((a, b) => a.hierarchy_id - b.hierarchy_id);

  const result = sortedParents.map(parent => {
    const { parent_path, hierarchy_id, ...rest } = parent;
    return {
      ...rest,
      subMenus: sortedChildren
        .filter(child => child.parent_path === parent.path)
        .map(({ parent_path, hierarchy_id, icon, ...restChild }) => restChild)
    };
  });

  return result;
};

export { getAccessItemHierarchy };

