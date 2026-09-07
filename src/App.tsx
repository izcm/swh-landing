import { useEffect, useState } from "react";
import {
  Nav,
  Hero,
  Steps,
  BuildOnExisting,
  HubShowcase,
  RealExample,
  Footer,
} from "./components";
import { AboutHero } from "./components/about/AboutHero";

function App() {
  const [tab, setTab] = useState<"story" | "about">(
    location.hash === "#about" ? "about" : "story",
  );

  useEffect(() => {
    const onHashChange = () =>
      setTab(location.hash === "#about" ? "about" : "story");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <Nav
        tabs={[
          { label: "Story", hash: "" },
          { label: "About", hash: "about" },
        ]}
      />
      {tab === "story" && (
        <>
          <Hero />
          <Steps />
          <BuildOnExisting />
          <HubShowcase />
          <RealExample />
        </>
      )}

      {tab === "about" && (
        <>
          <AboutHero />
        </>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}

export default App;
