// src/pages/OrderDebug.jsx

import { useState } from "react";
import { submitDemoOrder } from "../data/demoLogs.js";
import { summarizeOrder } from "../services/orderBuilder.js";
import {
  startConversation,
  handleUserTurn,
} from "../services/conversationEngine.js";

// Map the conversation session into an "order" object
// compatible with summarizeOrder (expects order.items[] and order.upsells).
function buildOrderFromSession(session) {
  if (!session) {
    return { items: [], upsells: [] };
  }

  const pizzaItem = {
    kind: "pizza",
    size: session.size,
    crust: session.crust,
    toppings: session.toppings || [],
    upsells: session.upsells || [],
    locationId: session.locationId,
  };

  return {
    items: [pizzaItem],
    orderType: session.orderType,
    address: session.address,
    phone: session.phone,
    name: session.name,
    locationId: session.locationId,
    // root-level upsells for orderBuilder.js
    upsells: session.upsells || [],
  };
}

export default function OrderDebug() {
  const [context, setContext] = useState(() => {
    const { session } = startConversation({ demo: true });
    return {
      sessionId: session.id,
      order: buildOrderFromSession(session),
    };
  });

  const [userInput, setUserInput] = useState("");

  function handleSend(e) {
    e.preventDefault();

    const { session: nextSession } = handleUserTurn(
      context.sessionId,
      userInput
    );

    const nextOrder = buildOrderFromSession(nextSession);

    setContext({
      sessionId: nextSession.id,
      order: nextOrder,
    });

    setUserInput("");
  }

  function handleReset() {
    const { session } = startConversation({ demo: true });

    setContext({
      sessionId: session.id,
      order: buildOrderFromSession(session),
    });
  }

  function handleSubmitOrder() {
    submitDemoOrder(context.order);
    alert("Demo order submitted! (Check Demo Logs tab)");
  }

  const safeOrder = context.order || { items: [], upsells: [] };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Order Debug</h1>
        <p className="text-sm text-gray-600">
          Inspect and manipulate the internal order object.
        </p>
      </header>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder="Type simulated user input…"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
        >
          Send
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleSubmitOrder}
          className="px-4 py-2 border rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
        >
          Submit Demo Order
        </button>
      </div>

      <section className="border rounded-md bg-white">
        <div className="border-b px-3 py-2">
          <h2 className="text-sm font-semibold">Order Object</h2>
        </div>
        <pre className="p-3 text-xs overflow-auto bg-gray-50">
{JSON.stringify(safeOrder, null, 2)}
        </pre>
      </section>

      <section className="border rounded-md bg-white">
        <div className="border-b px-3 py-2">
          <h2 className="text-sm font-semibold">Order Summary</h2>
        </div>
        <pre className="p-3 text-xs overflow-auto bg-gray-50">
{ summarizeOrder(safeOrder) }
        </pre>
      </section>
    </div>
  );
}

