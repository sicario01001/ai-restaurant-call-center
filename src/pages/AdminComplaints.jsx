// src/pages/AdminComplaints.jsx

import { useState } from "react";
import {
  getAllComplaints,
  markComplaintStatus,
} from "../data/complaintsDirectory.js";

const STATUS_LABELS = {
  new: "New",
  reviewed: "Reviewed",
  closed: "Closed",
};

const STATUS_CLASSES = {
  new: "bg-red-50 text-red-700 border-red-200",
  reviewed: "bg-amber-50 text-amber-800 border-amber-200",
  closed: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

function formatTimestamp(ts) {
  if (!ts) return "Unknown";
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return "Unknown";
  }
}

export default function AdminComplaints() {
  // Lazy initializer = no useEffect required, avoids ESLint warning
  const [complaints, setComplaints] = useState(() => getAllComplaints());

  function handleStatusChange(id, nextStatus) {
    markComplaintStatus(id, nextStatus);
    setComplaints(getAllComplaints());
  }

  function handleRefresh() {
    setComplaints(getAllComplaints());
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Customer Complaints (Demo)</h1>
        <p className="text-sm text-gray-600">
          Internal view of issues reported via the voice assistant. In a full
          production setup, these would also trigger real email notifications
          to the store or head office.
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center px-3 py-1.5 rounded-md border text-xs md:text-sm bg-white hover:bg-gray-50"
        >
          Refresh
        </button>
      </header>

      <section className="border rounded-lg bg-white overflow-hidden">
        <div className="border-b px-3 py-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Logged Complaints</h2>
          <span className="text-xs text-gray-500">
            Total: {complaints.length}
          </span>
        </div>

        {complaints.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">
            No complaints have been recorded yet. When a caller reports an
            issue, it will appear here automatically.
          </p>
        ) : (
          <div className="divide-y">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between"
              >
                <div className="space-y-1 text-sm">
                  <p className="text-xs text-gray-500 font-mono">
                    #{c.id} • {formatTimestamp(c.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <span className="font-mono">{c.phone}</span>
                  </p>
                  {c.locationId && (
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      <span>{c.locationId}</span>
                    </p>
                  )}
                  {c.orderType && (
                    <p>
                      <span className="font-semibold">Order type:</span>{" "}
                      <span>{c.orderType}</span>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Issue:</span>{" "}
                    <span>{c.issue}</span>
                  </p>
                </div>

                <div className="mt-2 md:mt-0 flex flex-col items-start gap-2">
                  <span
                    className={
                      "inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium " +
                      (STATUS_CLASSES[c.status] || STATUS_CLASSES.new)
                    }
                  >
                    {STATUS_LABELS[c.status] || STATUS_LABELS.new}
                  </span>

                  <label className="text-xs text-gray-500">
                    Update status:
                    <select
                      className="mt-1 block border rounded-md px-2 py-1 text-xs"
                      value={c.status}
                      onChange={(e) =>
                        handleStatusChange(c.id, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

