export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white text-xl font-bold">
          D
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">DefendML</h1>
        <p className="text-gray-600">AI Security Dashboard</p>
        <div className="flex gap-3 justify-center">
          <a href="/tester" className="px-4 py-2 rounded-lg bg-violet-600 text-white">
            Open Tester
          </a>
          <a href="/dashboard" className="px-4 py-2 rounded-lg bg-gray-900 text-white">
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
