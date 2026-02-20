import { Separator } from "@/components/ui/separator";

const quests = [
  { title: "Earn 20 XP", progress: 15, goal: 20 },
  { title: "Earn 50 XP", progress: 15, goal: 50 },
  { title: "Earn 100 XP", progress: 15, goal: 100 },
  { title: "Earn 500 XP", progress: 15, goal: 500 },
  { title: "Earn 1000 XP", progress: 15, goal: 1000 },
];

export default function QuestsPage() {
  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a] text-white min-h-screen">
      <div className="w-full max-w-[912px] px-6">
        <div className="flex flex-col items-center gap-y-4">
          <img src="/quests.svg" alt="Quests" height={90} width={90} />
          <h1 className="text-center font-bold text-2xl">Quests</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Complete quests by earning points.
          </p>
          <Separator className="mb-4 h-0.5" />
          <ul className="w-full">
            {quests.map((quest) => {
              const percentage = (quest.progress / quest.goal) * 100;
              return (
                <div
                  key={quest.title}
                  className="flex items-center w-full p-4 gap-x-4 border-t-2"
                >
                  <img src="/points.svg" alt="Points" width={40} height={40} />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-200 text-xl font-bold">
                      {quest.title}
                    </p>
                    <div className="h-3 w-full bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}