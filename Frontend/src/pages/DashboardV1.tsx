import { useLocation, Link } from "react-router-dom";

export default function DashboardV1() {
  const location = useLocation();
  const data = location.state?.data || null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard V1 - Raw Data</h1>

      {data ? (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>No dashboard data received.</p>
      )}

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go back home
      </Link>
    </div>
  );
}
