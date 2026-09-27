import { useEffect, useState } from "react";
import { Nav, Hero, Steps, Story, Demo, Footer } from "./components";
import { About } from "./components/about/About";
import { ActDiagram } from "./components/diagrams/ActDiagram";
import { AISvg, CodeEditor } from "./components/diagrams/about/AI";
// import { AISvg } from "./components/diagrams/about/AI";

function App() {
  const [tab, setTab] = useState<"story" | "about" | "tmp">(
    // "tmp",
    location.hash === "#about" ? "about" : "story",
  );

  useEffect(() => {
    const onHashChange = () =>
      setTab(location.hash === "#about" ? "about" : "story");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // the hash target (e.g. #demo) only exists once the tab has rendered,
  // so the browser's native anchor jump misses it — scroll manually
  useEffect(() => {
    const target =
      location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [tab]);

  return (
    <>
      <Nav
        current={tab}
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
          <Demo />
        </>
      )}

      {tab === "about" && (
        <>
          <About />
        </>
      )}

      {tab === "tmp" && (
        <>
          <div className="w-full h-auto">
            {/* <CodeEditor /> */}
            <AISvg />
          </div>
          {/* <ConnectDiagram /> */}
        </>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}

export default App;
