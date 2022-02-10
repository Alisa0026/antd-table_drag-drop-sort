import "./styles.css";
import React, { useState, useCallback, useRef } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

import { columns, tableData } from "./utils/data";
import { dataType, optionsTyps, findFromData, getParam } from "./utils/common";
import { DraggableBodyRow } from "./comp/row";

const App = () => {
  const [data, setData] = useState(tableData);

  const components = {
    body: {
      row: DraggableBodyRow
    }
  };

  const findRow = (id) => {
    const { row, index, parentIndex } = findFromData(tableData, id);
    return {
      row,
      rowIndex: index,
      rowParentIndex: parentIndex
    };
  };

  const moveRow = useCallback(
    (props) => {
      let { dragId, dropId, dropParentId, operateType, originalIndex } = props;

      let {
        dragRow,
        dropRow,
        dragIndex,
        dropIndex,
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

export default App;
