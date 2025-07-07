interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-h-screen">{children}</div>
    </div>
  );
};

export default Layout;
