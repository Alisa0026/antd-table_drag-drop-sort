export const ItemTypes = "DraggableBodyRow";

// 操作类型
export const optionsTyps = {
  didDrop: "didDrop", // 拖拽出区域
  hover: "hover",
  drop: "drop" // 放置
};

// 数据类型
export const dataType = {
  group: "group",
  child: "child"
};

export const getParam = (data, dragId, dropId) => {
  let dragRow, dropRow;
  let dragIndex, dropIndex;
  let dragParentIndex, dropParentIndex; // 拖拽子节点的父节点索引

  for (let i = 0; i < data.length; i++) {
    // 父节点拖拽
    let parentDom = data[i];
    if (parentDom.id === dragId) {
      dragRow = parentDom;
      dragIndex = i;
      dragParentIndex = null;
    }

    if (parentDom.id === dropId) {
      dropRow = parentDom;
      dropIndex = i;
      dropParentIndex = null;
    }

    // 子节点拖拽
    const ele = parentDom.children || [];
    for (let j = 0; j < ele.length; j++) {
      const child = ele[j];

      if (child.id === dragId) {
        dragRow = child;
        dragIndex = j;
        dragParentIndex = i;
      }

      if (child.id === dropId) {
        dropRow = child;
        dropIndex = j;
        dropParentIndex = i;
      }
    }
  }

  return {
    dragRow,
    dropRow,
    dragIndex,
    dropIndex,
    dragParentIndex,
    dropParentIndex
  };
};

export const findFromData = (data, id) => {
  let row, index, parentIndex;

  for (let i = 0; i < data.length; i++) {
    // 父节点拖拽
    let parentDom = data[i];
    if (parentDom.id === id) {
      row = parentDom;
      index = i;
      parentIndex = null;
    }

    // 子节点拖拽
    const ele = parentDom.children || [];
    for (let j = 0; j < ele.length; j++) {
      const child = ele[j];

      if (child.id === id) {
        row = child;
        index = j;
        parentIndex = i;
      }
    }
  }

  return {
    row,
    index,
    parentIndex
  };
};
