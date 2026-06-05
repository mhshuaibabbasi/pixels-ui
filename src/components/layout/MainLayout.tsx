import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
      <Navbar />
      <div className="pt-0 flex-1"> {/* Removed pt-14 padding to allow hero to underlap navbar */}
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
