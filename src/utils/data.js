export const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "人数",
    dataIndex: "number",
    key: "number"
  }
];

export const tableData = [
  {
    parentId: 0,
    id: 1,
    name: "分组1",
    number: "10",
    type: "group",
    children: [
      {
        parentId: 1,
        id: 2,
        name: "分组1-测试1",
        number: "2",
        type: "child"
      },
      {
        parentId: 1,
        id: 3,
        name: "分组1-测试2",
        number: "5",
        type: "child"
      },
      {
        parentId: 1,
        id: 4,
        name: "分组1-测试3",
        number: "3",
        type: "child"
      }
    ]
  },
  {
    parentId: 0,
    id: 5,
    name: "分组2",
    number: "3",
    type: "group",
    children: [
      {
        parentId: 5,
        id: 6,
        name: "分组2-测试1",
        number: "2",
        type: "child"
      },
      {
        parentId: 5,
        id: 7,
        name: "分组2-测试2",
        number: "1",
        type: "child"
      }
    ]
  },
  {
    parentId: 0,
    id: 8,
    name: "测试child-1",
    number: "3",
    type: "child"
  },
  {
    parentId: 0,
    id: 9,
    name: "测试child-2",
    number: "2",
    type: "child"
  }
];
