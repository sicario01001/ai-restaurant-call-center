// src/pages/admin/AdminHome.jsx
// Version 1 Admin Panel — Order List View
// Reads demo logs (local memory) and displays clickable sessions.

import { useState } from "react";
import { getAllLogs } from "../../services/logStore";
import AdminOrder from "./AdminOrder";

export default function AdminHome() {
  const [selectedId, setSelectedId] = useState(null);

  const logs = getAllLogs(); // [{id, createdAt, summary, transcript, ...}]

  if (selectedId) {
    return (
      <AdminOrder
        id={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Admin Panel — Demo Orders</h2>
      <p className="text-sm text-gray-600">
        These are demo-mode conversations stored locally for Version 1.  
        Click an order to view its details.
      </p>

      <div className="border rounded-md divide-y bg-white">
        {logs.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            No demo orders yet.
          </div>
        )}

        {logs.map((log) => (
          <button
            key={log.id}
            onClick={() => setSelectedId(log.id)}
            className="w-full text-left p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">
                  {log.summary?.name || "Unknown caller"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Demo
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              {log.summary?.summaryText || "No summary available"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

