import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <Button variant='outline'>Get Started</Button>
    </div>
  );
}
