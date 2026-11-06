import { useEffect, useLayoutEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import { Nav, Footer, Hero } from "./features";
import { Service, Services } from "./features/services";

function Layout() {
  const { pathname, state } = useLocation();

  useLayoutEffect(() => {
    if (state?.keepScroll) return;

    window.scrollTo(0, 0);
  }, [pathname, state]);

  return (
    <>
      <Nav
        tabs={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "Work", to: "/work" },
          // { label: "About", to: "/about" },
        ]}
      />

      <main className="min-h-dvh">
        <Outlet />
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}

function Home() {
  return (
    <>
      <div className="md:min-h-below-nav-and-dev-banner mb-12 flex flex-col overflow-x-clip">
        <Hero />
      </div>
      {/* <Story /> */}
      {/* <Demo /> */}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<Service />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
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
