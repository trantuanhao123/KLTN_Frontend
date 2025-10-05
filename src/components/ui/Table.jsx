import React from "react";

export default function Table({
  headers = [],
  data = [],
  renderRow,
  className = "",
}) {
  return (
    <div
      className={`overflow-x-auto rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <table className="min-w-full bg-white text-sm text-gray-700">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition">
                {renderRow(item, idx)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-6 text-gray-400"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
