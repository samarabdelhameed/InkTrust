export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">
            🖋️ <span className="text-blue-400">Ink</span>Trust
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Caregiver Dashboard</span>
            {/* TODO: Wallet connect button (Phantom/Privy) */}
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Live Pipeline Status */}
        <div className="col-span-full bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">📠 Live Fax Pipeline</h2>
          <p className="text-gray-400">Incoming fax requests will appear here in real-time.</p>
          {/* TODO: BullMQ stream integration */}
        </div>

        {/* Pending Approvals */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">⏳ Pending Approvals</h2>
          <p className="text-gray-400">No pending requests.</p>
          {/* TODO: List of fax requests awaiting caregiver approval */}
        </div>

        {/* Spending Overview */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">💰 Spending Overview</h2>
          <p className="text-gray-400">Daily limit: ¥3,000</p>
          <p className="text-gray-400">Spent today: ¥0</p>
          {/* TODO: Swig policy engine integration */}
        </div>

        {/* Trust Settings */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">🛡️ Trust Settings</h2>
          <p className="text-gray-400">Manage trusted contacts and spending limits.</p>
          {/* TODO: Settings for fax numbers, trusted contacts, Swig limits */}
        </div>
      </div>
    </main>
  );
}
