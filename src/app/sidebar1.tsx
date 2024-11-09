// src/app/Sidebar.tsx

export default function Sidebar() {
    return (
      <div className="fixed top-0 left-0 h-screen w-55 p-4 bg-gray-800 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-600 rounded-full">
              {/* Replace with an actual icon component or SVG */}
              <span className="text-white">⭐</span>
            </div>
            <span className="text-xl font-bold">FortuneTeller</span>
          </div>
          <nav className="space-y-4">
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              Upload Image
            </a>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              Setting
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="/leanne.png" // Replace with actual profile image path
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">Avery</p>
            <p className="text-xs text-gray-400">User</p>
          </div>
        </div>
      </div>
    );
  }
  