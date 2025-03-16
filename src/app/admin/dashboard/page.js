"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/add"
              className="block bg-blue-100 text-blue-700 p-3 rounded-md hover:bg-blue-200 transition-colors"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/products"
              className="block bg-green-100 text-green-700 p-3 rounded-md hover:bg-green-200 transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Add high-quality product images for better conversion rates</li>
            <li>Keep product descriptions detailed but concise</li>
            <li>Regularly check inventory levels to avoid stockouts</li>
            <li>Respond to customer orders promptly</li>
            <li>Update product information to keep it accurate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
