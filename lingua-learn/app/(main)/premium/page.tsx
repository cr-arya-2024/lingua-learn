import { Button } from "@/components/ui/button";

export default function PremiumPage() {
  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a] text-white min-h-screen">
      <div className="w-full max-w-[912px] px-6 text-center">
        <img src="/super.svg" alt="Super" height={120} width={120} className="mx-auto mb-6" />
        <h1 className="font-bold text-3xl mb-4">Go Premium!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Get unlimited hearts, no ads, and personalized practice.
        </p>
        <div className="bg-neutral-800 p-8 rounded-2xl border-2 border-neutral-700 max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4">$14.99 / month</h2>
          <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}