import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" prevents the user from seeing the page "slide" up
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return (
    <>
      <Navbar />
      <div className="layout-container">
        <main className="pt-16 h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default RootLayout;