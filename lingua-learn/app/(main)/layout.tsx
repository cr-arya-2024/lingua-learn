import { Sidebar } from '@/components/sidebar';
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-full'>
      <Sidebar className='hidden lg:flex' />
      <main className='lg:pl-[256px] h-full w-full'>
        <div className='max-w-[1056px] mx-auto pt-6 h-full'>{children}</div>
      </main>
    </div>
  );
};
export default MainLayout;
