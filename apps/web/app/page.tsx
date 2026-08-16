import Footer from "../components/sections/footer/default";
import Hero from "../components/sections/hero/default";
import Items from "../components/sections/items/default";
import Navbar from "../components/sections/navbar/default";
import { LayoutLines } from "../components/ui/layout-lines";
import WorkflowSection from "../components/WorkflowSection";

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <Navbar />
      <Hero />
      <Items />
      <WorkflowSection />
      <Footer />
    </main>
  );
}
