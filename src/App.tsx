import { useEffect, useState } from "react";
import { Nav, Hero, Steps, Story, Footer } from "./components";
import { AboutHero } from "./components/about/AboutHero";
import { ConnectDiagram } from "./components/diagrams/ConnecDiagram";

function App() {
  const [tab, setTab] = useState<"story" | "about" | "tmp">(
    // location.hash === "#about" ? "about" : "story",
    "story",
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
          <Story />
        </>
      )}

      {tab === "about" && (
        <>
          <AboutHero />
        </>
      )}

      {tab === "tmp" && <ConnectDiagram />}

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}

export default App;
