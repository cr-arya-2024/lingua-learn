import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ShopPage() {
  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a] text-white min-h-screen">
      <div className="w-full max-w-[912px] px-6">
        <div className="flex flex-col items-center gap-y-4">
          <img src="/shop.svg" alt="Shop" height={90} width={90} />
          <h1 className="text-center font-bold text-2xl">Shop</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Spend your points on cool things.
          </p>
          <Separator className="mb-4 h-0.5" />
          <div className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
              <img src="/heart.svg" alt="Heart" height={60} width={60} />
              <div className="flex-1">
                <p className="text-neutral-200 text-base lg:text-xl font-bold">
                  Refill hearts
                </p>
              </div>
              <Button>
                50 points
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}