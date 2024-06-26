import Nav from "./nav";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Nav />
      <main className="w-full p-4 overflow-auto">{children}</main>
    </div>
  );
}
