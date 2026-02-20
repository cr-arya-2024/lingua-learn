import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const mockLeaderboard = [
  { name: "User 1", xp: 15000, avatar: "https://github.com/shadcn.png" },
  { name: "User 2", xp: 12000, avatar: "https://github.com/shadcn.png" },
  { name: "User 3", xp: 11000, avatar: "https://github.com/shadcn.png" },
  { name: "User 4", xp: 9000, avatar: "https://github.com/shadcn.png" },
  { name: "User 5", xp: 8500, avatar: "https://github.com/shadcn.png" },
  { name: "User 6", xp: 7000, avatar: "https://github.com/shadcn.png" },
  { name: "User 7", xp: 6500, avatar: "https://github.com/shadcn.png" },
  { name: "User 8", xp: 5000, avatar: "https://github.com/shadcn.png" },
  { name: "User 9", xp: 4500, avatar: "https://github.com/shadcn.png" },
  { name: "User 10", xp: 3000, avatar: "https://github.com/shadcn.png" },
];

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a] text-white min-h-screen">
      <div className="w-full max-w-[912px] px-6">
        <div className="flex flex-col items-center gap-y-4">
          <img src="/leaderboard.svg" alt="Leaderboard" height={90} width={90} />
          <h1 className="text-center font-bold text-2xl">Leaderboard</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5" />
          {mockLeaderboard.map((user, index) => (
            <div
              key={user.name}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/5 transition"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-bold text-neutral-200 flex-1">{user.name}</p>
              <p className="text-muted-foreground">{user.xp} XP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}