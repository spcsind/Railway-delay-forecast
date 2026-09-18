function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-xl">
            🚆
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              RailETA
            </h1>

            <p className="text-xs text-gray-500">
              Dynamic Train ETA Forecast
            </p>
          </div>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

          <span className="text-sm font-medium text-gray-700">
            Live
          </span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;