// src/pages/admin/AdminOrder.jsx
// Shows order summary + transcript for a single demo session.

import { getLogById } from "../../services/logStore";

export default function AdminOrder({ id, onBack }) {
  const log = getLogById(id);

  if (!log) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 underline"
        >
          ← Back to Admin
        </button>
        <p className="text-red-600">Order not found.</p>
      </div>
    );
  }

  const { summary, transcript } = log;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-sm text-blue-600 underline"
      >
        ← Back to all orders
      </button>

      <h2 className="text-lg font-semibold">
        Order Details — {summary?.name || "Unknown caller"}
      </h2>

      <div className="text-xs text-gray-500">
        Created at: {new Date(log.createdAt).toLocaleString()}
      </div>

      {/* Order summary */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-medium mb-2">Summary</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {summary?.summaryText || "No summary available"}
        </pre>
      </div>

      {/* Transcript */}
      <div className="border rounded-md p-4 bg-white">
        <h3 className="font-medium mb-2">Transcript</h3>

        <div className="space-y-4 text-sm">
          {transcript?.map((turn, i) => (
            <div key={i} className="space-y-1">
              <div className="text-gray-800 font-medium">
                Caller:
              </div>
              <div className="pl-3 text-gray-700">{turn.user}</div>

              <div className="text-gray-800 font-medium">
                Assistant:
              </div>
              <div className="pl-3 text-gray-700">
                {turn.bot?.join("\n")}
              </div>

              {turn.audioUrls && (
                <div className="pl-3">
                  {turn.audioUrls.map((url, j) => (
                    <audio key={j} src={url} controls />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

