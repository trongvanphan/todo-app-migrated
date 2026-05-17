import { Header } from "@/components/Header";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
