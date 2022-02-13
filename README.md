# antd-table_drag-drop-sort

基于 antd 树形表格 table 的拖拽排序效果实现

> 版权声明：本文为博主原创文章，未经博主允许不得转载。 文章底部留言可联系作者。

# 一、背景

根据业务需要，需要实现**树状表格**的拖拽排序，因为基于`antd`开发的，而`antd`官方拖拽 demo 也只是简单的普通表格拖拽，这个并不能满足实际业务需要。如下：

- [拖拽排序](https://ant.design/components/table-cn/#components-table-demo-drag-sorting) 使用的 [react-dnd ](https://github.com/react-dnd/react-dnd)，使用起来 API 稍微复杂需要研究学习，并且拖拽的时候每次都是对数据进行修改，感觉这都不如下面的`react-sortable-hoc`。优点就是我个人觉得对于实现**树状表格**的拖拽排序比较友好方便，所以我最终使用的是这个第三方库实现的效果。
- [拖拽手柄列](https://ant.design/components/table-cn/#components-table-demo-drag-sorting-handler) 使用的 [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc)，优点是不需要处理拖拽的一些动画效果，并且拖拽的过程只是单纯的样式修改，当最后放置的时候才真正的进行数据修改。

我根据查看 antd 使用的两个拖拽第三方库，最终决定使用 [react-dnd ](https://github.com/react-dnd/react-dnd) 来实现效果。先放效果图：

![拖拽1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc8c0f7ca2924c43bfe9d144663e5410~tplv-k3u1fbpfcp-watermark.image?)

下面就说一下实现原理。

# 二、拖拽排序实现

首先查看了先 [react-dnd 的文档](https://react-dnd.github.io/react-dnd/about)，主要参考排序 [Sortable 示例](https://react-dnd.github.io/react-dnd/examples/sortable/simple)进行实现。

## 1. 安装

```
npm install react-dnd react-dnd-html5-backend --save
```

## 2. 使用`DndProvider`包裹`table`

> 文档描述：The DndProvider component provides React-DnD capabilities to your application. This must be injected with a backend via the `backend`prop, but it may be injected with a `window`object.

> 简单翻译：DndProvider 组件可以为你的应用提供 React-Dnd 的能力。必须通过 backend 这个属性进行注入，也可以通过 window 对象进行注入。

```js
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Table } from "antd";
....

return (
    <DndProvider backend={HTML5Backend}>
        <Table
          ...
        />
    </DndProvider>
)
```

## 3. 参考 antd 官方示例，进行改造

首先看下 antd `table`的`api`中`onRow`的用法：

![table的onRow的用法.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/796ff1d40b1d4640b895c07daa37684e~tplv-k3u1fbpfcp-watermark.image?)

以及`components`的用法，覆盖默认的 table 元素：

![components用法.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6564fbb987224d29a30d61325375bdd4~tplv-k3u1fbpfcp-watermark.image?)

接下来可以先实现一部分：对 components 和 onRow 的实现

```js
//data.js 准备数据

// table列
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
// 数据
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
```

```js
//app.js

import React, { useState, useCallback, useRef } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { columns, tableData } from "./utils/data";
import { DraggableBodyRow } from "./comp/row";

const App = () => {
  const [data, setData] = useState(tableData);

  const components = {
    body: {
      row: DraggableBodyRow // 这里后面说
    }
  };

  const moveRow = useCallback(
    (props) => {
     ...
     //这里主要对拖拽后的数据进行操作
    },
    [data]
  );

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={columns}
          dataSource={data}
          components={components}
          rowKey={(record) => record.id}
          onRow={(record, index) => ({
            record,  // 当前数据
            data,    // 完整数据
            index,   // 当前数据索引
            moveRow  // 移动后修改数据的方法
          })}
        />
      </DndProvider>
    </div>
  );
};

export default App;
```

## 4、实现`DraggableBodyRow`这个组件

可以看到 `components`的作用是覆盖默认 table 元素的。这里我们需要覆盖的是 `body`中的 `row`。

### 准备需要的一些常量：

```js
//common.js

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
```

### 要特别注意使用 react-dnd 中的两个方法：

#### 1）useDrag

useDrag 是一个 hook 方法，提供了一种方法让你的组件可以作为拖动源连接到 DnD 系统。
给 useDrag 传入文档规定传递的参数，需要声明行地描述正在生成可拖拽的`type（类型）`,`item`对象代表拖动源，以及`collect`的属性等等。
useDrag 这个方法会返回一些参数：一组收集（collect 函数收集）的属性、以及拖拽源和拖拽预览元素

```js
const [collected, drag, dragPreview] = useDrag(() => ({
  type,
  item: { id }
}));
```

#### 2）useDrop

useDrop 是一个 hook 方法，提供了一种方法让你的组件可以作为放置目标连接到 DnD 系统。给 useDrop 传入文档规定传递的参数，可以指定让放置目标接收(`accept`)什么类型的数据项，`collect`的属性，等等。
useDrop 会返回一个数组，包含要放到放置目标的节点和 collect 函数收集的属性。

```js
const [collectedProps, drop] = useDrop(() => ({
  accept
}));
```

### 具体实现：

```js
// row.js

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { dataType, ItemTypes, optionsTyps } from "../utils/common";

export const DraggableBodyRow = (props) => {
  let {
    record, // 当前行数据
    data, // 完整数据
    index, //当前行数据索引
    className,
    style,
    moveRow, // 移动后修改数据的方法
    findRow,
    ...restProps
  } = props;

  if (!record) return null;

  let itemObj = {
    id: record.id,
    parentId: record.parentId,
    index,
    isGroup: record.type === dataType.group
  };

  let isDrag = true; // 是否可以拖拽，这里所有行均可拖拽，所以没有做判断限制

  const ref = useRef();

  // useDrop 是一个hook方法，提供了一种方法让你的组件可以作为放置目标连接到DnD系统。
  const [{ handlerId, isOver, dropClassName }, drop] = useDrop({
    accept: ItemTypes, // 只对useDrag的type的值为ItemTypes时才做出反应
    collect: (monitor) => {
      const {
        id: dragId,
        parentId: dragParentId,
        index: dragPreIndex,
        isGroup
      } = monitor.getItem() || {}; // 这里获取的数据内容同 itemObj

      // 如果拖拽的id和当前行相等则不处理
      if (dragId === record.id) {
        return {};
      }

      // 是否可以拖拽替换
      let isOver = monitor.isOver();
      if (isGroup) {
        // 要覆盖的数据是分组，或者是最外层的子项可以替换，其他情况不可以
        let recordIsGroup = record.type === dataType.group;
        if (!recordIsGroup) {
          isOver = false;
        }
      } else {
        // 要覆盖的数据是子项，但不在同分组不可以替换
        if (dragParentId !== record.parentId) {
          isOver = false;
        }
      }

      return {
        isOver, // 是否覆盖
        dropClassName: "drop-over-downward", // 拖拽hover时样式
        handlerId: monitor.getHandlerId()
      };
    },
    drop: (item) => {
      //
      let opt = {
        dragId: item.id, // 拖拽id
        dropId: record.id, // 要放置位置行的id
        dropType: record.type,
        dropParentId: record.parentId,
        operateType: optionsTyps.drop
      };
      moveRow(opt); // 调用传入的方法完成数据修改
    }
  });

  // useDrag 是hook方法，提供了一种方法让你的组件可以作为拖动源连接到DnD系统。
  // isDragging是通过 collect收集并解构出来的属性
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes, // 可拖拽的类型
    item: itemObj, // 拖动源
    collect: (monitor) => ({
      // 收集器
      isDragging: monitor.isDragging() // css样式需要
    })
  });

  // ref 这样处理可以使得这个组件既可以被拖动也可以接受拖动
  drop(drag(ref));

  // 拖拽行的位置显示透明
  const opacity = isDragging ? 0 : 1;

  return (
    <tr
      ref={ref}
      className={`${className}
      ${isOver ? dropClassName : ""} 
      ${isDrag ? "can-drag" : ""}`}
      style={isDrag ? { cursor: "move", opacity, ...style } : { ...style }}
      data-handler-id={handlerId}
      {...restProps}
    />
  );
};
```

## 5、拖拽的一些细节做处理

拖拽的时候，我们有两个细节需要处理。效果如下图：

![拖拽细节.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b88f7a916304ee7a8b6f81cb1ce3481~tplv-k3u1fbpfcp-watermark.image?)

#### 1） 每次拖拽其他行都会被挤着往下或者往上走。

需要在 `useDrop` 方法中新增 `hover` 参数，这里参考[react-dnd 示例](https://react-dnd.github.io/react-dnd/examples/sortable/simple) 进行实现

```js
// row.js

const [{ handlerId, isOver, dropClassName }, drop] = useDrop({
    accept: ItemTypes,
    collect: (monitor) => {
      ...
    },
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const dropIndex = index;
      // Don't replace items with themselves
      if (dragIndex === dropIndex) {
        return;
      }

      let opt = {
        dragId: item.id, // 拖拽id
        dropId: record.id, // 要放置位置行的id
        dropType: record.type,
        dropParentId: record.parentId,
        operateType: optionsTyps.hover // hover操作
      };

      moveRow(opt);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = dropIndex;
    },
    drop: (item) => {
      ...
    }
  });

```

#### 2） 并且拖拽出拖拽区域后放开鼠标依然在初始位置不变。

这里`useDrag` 要加 `end`参数，这里参考[react-dnd 示例](https://react-dnd.github.io/react-dnd/examples/sortable/cancel-on-drop-outside) 进行实现：

```js
// row.js

const [{ isDragging }, drag] = useDrag({
  type: ItemTypes,
  item: itemObj,
  collect: (monitor) => ({
    isDragging: monitor.isDragging()
  }),
  end: (item, monitor) => {
    const { id: droppedId, originalRow } = item;
    const didDrop = monitor.didDrop();
    // 超出可拖拽区域，需要将拖拽行还原
    if (!didDrop) {
      let opt = {
        dragId: droppedId, // 拖拽id
        dropId: originalRow.id, // 要放置位置行的id
        dropType: originalRow.type,
        dropParentId: originalRow.parentId,
        originalIndex,
        originalParentIndex,
        operateType: optionsTyps.didDrop
      };
      moveRow(opt);
    }
  }
});
```

为了还原初始位置，在 App.js 中需要新增一个方法 `findRow`

```js
// App.js

const App = () => {
  const [data, setData] = useState(tableData);

  const components = {
    body: {
      row: DraggableBodyRow
    }
  };

  const findRow = (id) => {
    // 通过原始数据，根据id查询到对应数据信息和索引
    const { row, index, parentIndex } = findFromData(tableData, id);
    return {
      row,
      rowIndex: index,
      rowParentIndex: parentIndex
    };
  };

  const moveRow = useCallback(
    (props) => {
    ...
    },
    [data]
  );

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={columns}
          dataSource={data}
          components={components}
          rowKey={(record) => record.id}
          onRow={(record, index) => ({
            record,
            data,
            index,
            moveRow,
            findRow
          })}
        />
      </DndProvider>
    </div>
  );
};
```

## 6、实现 moveRow

需要分情况对拖拽数据进行处理，包括如下几种：

- 针对分组拖拽排序时的处理
- 针对子项拖拽排序时的处理
- 分组和分组同级别的子项，拖拽排序时也要进行特殊处理

**注意：暂不支持夸分组拖拽排序**

```js
//App.js

...
const moveRow = useCallback(
    (props) => {
      let {
        dragId, //拖拽id
        dropId, //放置id
        dropParentId, //放置父id
        operateType, //操作
        originalIndex // 原始索引
      } = props;

      let {
        dragRow, // 拖拽row
        dropRow, // 放置row
        dragIndex, //拖拽索引
        dropIndex, // 放置索引
        dragParentIndex, // 拖拽子节点的父节点索引
        dropParentIndex // 放置子节点父节点索引
      } = getParam(data, dragId, dropId);

      // 拖拽是否是组
      let dragIsGroup = dragRow.type === dataType.group || !dragRow.parentId;
      // 放置的是否是组
      let dropIsGroup = !dropParentId;

      // 根据变化的数据查找拖拽行的row和索引
      const {
        row,
        index: rowIndex,
        parentIndex: rowParentIndex
      } = findFromData(data, dragId);

      let newData = data;
      // 组拖拽
      if (dragIsGroup && dropIsGroup) {
        // 超出出拖拽区域还原
        if (operateType === optionsTyps.didDrop) {
          newData = update(data, {
            $splice: [
              [rowIndex, 1], //删除目前拖拽的索引的数据
              [originalIndex, 0, row] // 将拖拽数据插入原始索引位置
            ]
          });
        } else {
          // 修改拖拽后位置
          newData = update(data, {
            $splice: [
              [dragIndex, 1],
              [dropIndex, 0, dragRow]
            ]
          });
        }
      }
      // 同一组下的子项拖拽
      else if (dragRow.parentId === dropRow?.parentId) {
        // 超出拖拽区域还原
        if (operateType === optionsTyps.didDrop) {
          newData = update(data, {
            [dragParentIndex]: {
              children: {
                $splice: [
                  [rowIndex, 1],
                  [originalIndex, 0, row]
                ]
              }
            }
          });
        } else {
          // 修改拖拽后位置
          newData = update(data, {
            [dragParentIndex]: {
              children: {
                $splice: [
                  [dragIndex, 1],
                  [dropIndex, 0, dragRow]
                ]
              }
            }
          });
        }
      }

      setData(newData);
    },
    [data]
  );

...
```

[点击查看以上代码 demo 地址](https://codesandbox.io/s/shu-xing-tabletuo-zhuai-pai-xu-3k5wi)

# 参考文献

- [react-dnd](https://react-dnd.github.io/react-dnd/about)
- [antd table 拖拽排序](https://ant.design/components/table-cn/#components-table-demo-drag-sorting)
- [React 拖拽排序组件库对比研究](https://zhuanlan.zhihu.com/p/430177180)
- [拖拽组件 react-dnd 拖动排序的使用](https://juejin.cn/post/6918660279505338381)
- [react-dnd 用法详解](https://juejin.cn/post/6844903801120358407#heading-18)
