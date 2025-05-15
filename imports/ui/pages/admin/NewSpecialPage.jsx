import React, { useState } from 'react';

emptyRow = {
  gridType: 'full',
  columns: [
    {
      type: 'text',
      content: {},
    },
  ],
};

export default function NewSpecialPage() {
  const [rows, setRows] = useState([emptyRow]);

  return (
    <div>
      <h1>New Special Page</h1>
      <button onClick={() => setRows([...rows, emptyRow])}>Add Row</button>
      {rows.map((row, index) => (
        <div key={index}>
          <h2>Row {index + 1}</h2>
          <button onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove Row</button>
          <div>
            <label>Grid Type</label>
            <select
              value={row.gridType}
              onChange={(e) =>
                setRows(rows.map((r, i) => (i === index ? { ...r, gridType: e.target.value } : r)))
              }
            >
              <option value="1+1">1+1</option>
              <option value="1+1+1">1+1+1</option>
              <option value="1+2">1+2</option>
              <option value="2+1">2+1</option>
              <option value="full">full</option>
            </select>
          </div>

          <div>
            {row.columns.map((column, columnIndex) => (
              <div key={columnIndex}>
                <h3>Column {columnIndex + 1}</h3>
                <button
                  onClick={() =>
                    setRows(
                      rows.map((r, i) =>
                        i === index
                          ? { ...r, columns: r.columns.filter((_, j) => j !== columnIndex) }
                          : r
                      )
                    )
                  }
                >
                  Remove Column
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setRows(
                  rows.map((r, i) =>
                    i === index
                      ? { ...r, columns: [...r.columns, { type: 'text', content: {} }] }
                      : r
                  )
                )
              }
            >
              Add Column
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
