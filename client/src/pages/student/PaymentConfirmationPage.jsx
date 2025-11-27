// PaymentConfirmation.jsx
import React from "react";

/**
 * Props:
 *  - payment: object (Razorpay payment object)
 *  - receiptUrl?: string (optional link to receipt PDF)
 *  - onBack?: () => void (optional callback for "Back to courses")
 */
export default function PaymentConfirmation({ payment, receiptUrl, onBack }) {
  if (!payment) return null;

  const formatINR = (paise) =>
    `₹${(Number(paise) / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;

  const createdAtMs = (payment.created_at || 0) * 1000;
  const createdDate = new Date(createdAtMs);
  const fee = payment.fee ?? 0;
  const tax = payment.tax ?? 0;
  const net = Number(payment.amount ?? 0) - Number(fee) - Number(tax);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // tiny feedback
      alert("Copied to clipboard");
    } catch {
      alert("Unable to copy");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 sm:p-10">
        {/* header */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-emerald-100 p-3">
            {/* check icon */}
            <svg
              className="w-7 h-7 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Payment Confirmed
            </h1>
            <p className="text-sm text-gray-500">
              Thank you — your payment was successful.
            </p>
          </div>

          <div className="ml-auto text-right">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                payment.status === "captured"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {payment.status ? payment.status.toUpperCase() : "UNKNOWN"}
            </span>
          </div>
        </div>

        {/* main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Amount card */}
          <div className="sm:col-span-2 bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-baseline gap-3">
              <div className="text-sm text-gray-500">Amount Paid</div>
              <div className="ml-auto text-xs text-gray-400">Payment ID</div>
            </div>

            <div className="mt-2 flex items-center gap-4">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">
                  {formatINR(payment.amount)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {payment.method
                    ? `${payment.method} • ${payment.bank || ""}`
                    : ""}
                </div>
              </div>

              <div className="ml-auto text-sm">
                <div className="font-medium text-gray-700 break-all">
                  {payment.id}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleCopy(payment.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                    title="Copy payment id"
                  >
                    Copy ID
                  </button>
                  {receiptUrl && (
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Download Receipt
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 flex items-center gap-3">
              <div>
                <span className="font-medium text-gray-700">Order:</span>{" "}
                <span className="break-all">{payment.order_id}</span>
              </div>
              <div className="ml-auto">
                <span className="text-gray-500">
                  {createdDate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown card */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-700">
              Payment breakdown
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Gross amount</span>
                <span className="font-medium text-gray-800">
                  {formatINR(payment.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Fee</span>
                <span className="font-medium text-gray-800">
                  {formatINR(fee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-gray-800">
                  {formatINR(tax)}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  Net received
                </span>
                <span className="font-semibold text-gray-900">
                  {formatINR(net)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* metadata */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Payer</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="text-gray-500">Email:</span>{" "}
                <span className="text-gray-700">{payment.email || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500">Contact:</span>{" "}
                <span className="text-gray-700">{payment.contact || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Transaction details
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="text-gray-500">Method:</span>{" "}
                <span className="text-gray-700">{payment.method || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500">Bank / Acquirer:</span>{" "}
                <span className="text-gray-700">
                  {payment.bank ||
                    payment.acquirer_data?.bank_transaction_id ||
                    "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Captured:</span>{" "}
                <span className="text-gray-700">
                  {payment.captured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
          >
            Print / Save
          </button>

          <button
            onClick={() => handleCopy(payment.id)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
          >
            Copy Payment ID
          </button>

          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Download Receipt
            </a>
          )}

          <div className="ml-auto">
            <button
              onClick={() =>
                onBack ? onBack() : (window.location.href = "/courses")
              }
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
            >
              Back to Courses
            </button>
          </div>
        </div>

        {/* small note */}
        <div className="mt-6 text-xs text-gray-400">
          <p>
            This is an auto-generated payment confirmation. For disputes or
            refunds, contact support with the payment ID shown above.
          </p>
        </div>
      </div>
    </div>
  );
}
