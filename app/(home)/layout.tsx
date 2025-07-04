import { DotBackground } from "@/components/Background";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <div className="flex flex-1 flex-col px-4">
        <DotBackground>{children}</DotBackground>
      </div>
    </main>
  );
};

export default Layout;
