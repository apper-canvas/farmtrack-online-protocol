import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "", icon: "LayoutDashboard" },
    { name: "Crops", href: "crops", icon: "Sprout" },
    { name: "Tasks", href: "tasks", icon: "CheckSquare" },
    { name: "Expenses", href: "expenses", icon: "DollarSign" },
    { name: "Weather", href: "weather", icon: "Cloud" },
    { name: "Settings", href: "settings", icon: "Settings" }
  ];

  const NavItem = ({ item, mobile = false }) => {
    const isActive = location.pathname === `/${item.href}` || 
                    (item.href === "" && location.pathname === "/");
    
    return (
      <NavLink
        to={item.href === "" ? "/" : `/${item.href}`}
        className={({ isActive: linkActive }) => cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
          linkActive || isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
        )}
        onClick={() => mobile && setIsMobileOpen(false)}
      >
        {(isActive || location.pathname === `/${item.href}` || 
          (item.href === "" && location.pathname === "/")) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl"
            layoutId="activeNav"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "h-5 w-5 relative z-10 transition-colors",
            isActive || location.pathname === `/${item.href}` || 
            (item.href === "" && location.pathname === "/")
              ? "text-white" 
              : "text-gray-500 group-hover:text-primary-600"
          )} 
        />
        <span className="relative z-10 font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-100"
      >
        <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl border-r border-gray-100">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
                  <ApperIcon name="Leaf" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    FarmTrack
                  </h1>
                  <p className="text-xs text-gray-500">Farm Management</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-100 p-4">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-gradient-to-br from-accent-400 to-accent-500 rounded-lg">
                <ApperIcon name="User" className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Farm Manager</p>
                <p className="text-xs text-gray-500 truncate">Active Farm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 flex z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.div
                className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <ApperIcon name="X" className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
                        <ApperIcon name="Leaf" className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          FarmTrack
                        </h1>
                        <p className="text-xs text-gray-500">Farm Management</p>
                      </div>
                    </div>
                  </div>
                  <nav className="mt-5 px-4 space-y-2">
                    {navItems.map((item) => (
                      <NavItem key={item.name} item={item} mobile={true} />
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-100 p-4">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-gradient-to-br from-accent-400 to-accent-500 rounded-lg">
                      <ApperIcon name="User" className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Farm Manager</p>
                      <p className="text-xs text-gray-500 truncate">Active Farm</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;