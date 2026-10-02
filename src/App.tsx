import { useEffect, useState } from "react";
import { Nav, Footer, Hero, Steps, Story, Demo, About } from "./features";
import { HeroDiagram } from "./features/hero/Diagram";
// import { AISvg } from "./features/about/diagrams/ai/diagram";

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
          <div className="min-h-below-nav-and-dev-banner flex flex-col">
            <Hero />
            {/* <Steps /> */}
          </div>
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
        <div className="w-full h-full">
          <HeroDiagram />
        </div>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}

function ScrollPlayground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
      console.log(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-[200vh] pt-40">
      <div
        className="w-20 h-20 bg-blue-500"
        style={{
          transform: `translateY(${scrollY}px)`,
        }}
      />
    </div>
  );
}

export default App;
