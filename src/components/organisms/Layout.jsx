import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="lg:pt-0 pt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;