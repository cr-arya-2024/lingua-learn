import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col p-6 bg-[#1a1a1a] text-white min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Continue your learning journey.</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-green-400">Daily Streak</h2>
            <p className="text-4xl font-extrabold">7 Days</p>
          </div>
          <div className="bg-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-blue-400">Total XP</h2>
            <p className="text-4xl font-extrabold text-yellow-400">1,250</p>
          </div>
        </div>
        <Link href="/learn" className="block bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-xl text-center mb-6">Start Lesson</Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/leaderboard" className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 text-center"><p className="font-bold">Leaderboard</p></Link>
          <Link href="/quests" className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 text-center"><p className="font-bold">Quests</p></Link>
          <Link href="/shop" className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 text-center"><p className="font-bold">Shop</p></Link>
          <Link href="/premium" className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 text-center"><p className="font-bold">Premium</p></Link>
        </div>
      </div>
    </div>
  );
}
