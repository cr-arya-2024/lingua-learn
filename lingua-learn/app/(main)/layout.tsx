import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-full bg-[#1f1f1f] text-white'>
      <Sidebar className='hidden lg:flex' />
      <main className='lg:pl-[256px] h-full w-full'>
        <div className='max-w-[1056px] mx-auto pt-6 h-full pb-20 lg:pb-6 px-4 lg:px-6'>
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

export default MainLayout;
