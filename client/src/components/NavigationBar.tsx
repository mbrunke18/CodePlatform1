/**
 * @deprecated Use StandardNav or PageLayout instead.
 * This component is kept for backwards compatibility but should not be used in new pages.
 * - For marketing/landing pages: use StandardNav
 * - For platform pages with sidebar: use PageLayout
 */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { CommandCenterStatusBar } from "./CommandCenterStatusBar";

export default function NavigationBar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const newState = html.classList.contains('dark');
    setIsDark(newState);
    localStorage.setItem('m-theme', newState ? 'dark' : 'light');
  };

  const productLinks = [
    { title: "Command Center", href: "/command-center", description: "Unified command center: FRI, velocity, preparedness", featured: true },
    { title: "Playbook Library", href: "/playbook-library", description: "170 pre-built strategic playbooks" },
    { title: "Live Demos", href: "/demo-hub", description: "Watch Readiness OS in action" },
    { title: "Pricing", href: "/calculator", description: "ROI calculator" },
  ];

  const solutionsLinks = [
    { title: "By Role", href: "/demo-selector", description: "CEO, CFO, COO, CTO, CMO, CRO" },
    { title: "By Industry", href: "/demo-selector", description: "Financial, Healthcare, Manufacturing" },
    { title: "By Use Case", href: "/demo-selector", description: "M&A, Crisis, Launch, Competition" },
  ];

  const dynamicStrategyLinks = [
    { title: "Command Center", href: "/command-center", description: "Real-time execution coordination", featured: true },
    { title: "Playbook Library", href: "/playbook-library", description: "170 strategic playbooks" },
    { title: "Foresight Radar", href: "/foresight-radar", description: "Weak signal detection & Oracle AI" },
    { title: "Future Gym", href: "/future-gym", description: "Strategic training & simulations" },
    { title: "Living Playbooks", href: "/living-playbooks", description: "Self-learning execution guides" },
    { title: "Continuous Mode", href: "/continuous-mode", description: "Always-on operations" },
  ];

  const resourcesLinks = [
    { title: "Documentation", href: "#", description: "Getting started guides" },
    { title: "Case Studies", href: "#", description: "Customer success stories" },
    { title: "Blog", href: "#", description: "Insights and updates" },
    { title: "Support", href: "#", description: "Get help" },
  ];

  const companyLinks = [
    { title: "About Us", href: "#", description: "Our mission and team" },
    { title: "Careers", href: "#", description: "Join our team" },
    { title: "Contact", href: "#", description: "Get in touch" },
  ];

  const navigateAndClose = (href: string) => {
    setLocation(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateAndClose('/')}
            data-testid="nav-logo"
          >
            <div className="w-10 h-10 bg-white dark:bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-xl">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Readiness OS</span>
              <span className="text-xs block text-gray-600 dark:text-slate-300">Strategic Readiness Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Product */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {productLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => {
                                setLocation(link.href);
                              }}
                              className={`w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                                (link as any).featured 
                                  ? 'bg-gradient-to-r from-[#0A0F2E] dark:from-[#0A0F2E] to-[#141B45] dark:to-[#141B45] hover:from-[#F8F7F4] dark:hover:from-[#0A0F2E] hover:to-[#141B45] dark:hover:to-[#141B45] border-2 border-[#E8E4DC] dark:border-[#0A0F2E]' 
                                  : 'hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E]'
                              }`}
                            >
                              <div className={`text-sm font-medium leading-none ${(link as any).featured ? 'text-[#0A0F2E] dark:text-[#0A0F2E] flex items-center gap-2' : 'text-slate-900 dark:text-slate-100'}`}>
                                {(link as any).featured && <span className="text-xs px-2 py-0.5 bg-[#0A0F2E] dark:bg-[#0A0F2E] text-white rounded-full">NEW</span>}
                                {link.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-slate-300">
                                {link.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Solutions */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {solutionsLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => {
                                setLocation(link.href);
                              }}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E]"
                            >
                              <div className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{link.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-slate-300">
                                {link.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Dynamic Strategy */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50 font-semibold">
                    <span className="flex items-center gap-1">
                      Dynamic Strategy
                      <span className="text-xs px-2 py-0.5 bg-[#0A0F2E] dark:bg-[#0A0F2E] text-white rounded-full ml-1">NEW</span>
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[450px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {dynamicStrategyLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => {
                                setLocation(link.href);
                              }}
                              className={`w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                                (link as any).featured 
                                  ? 'bg-gradient-to-r from-[#0A0F2E] dark:from-[#0A0F2E] to-[#141B45] dark:to-[#141B45] hover:from-[#F8F7F4] dark:hover:from-[#0A0F2E] hover:to-[#141B45] dark:hover:to-[#141B45] border-2 border-[#E8E4DC] dark:border-[#0A0F2E]' 
                                  : 'hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E]'
                              }`}
                            >
                              <div className={`text-sm font-medium leading-none ${(link as any).featured ? 'text-[#0A0F2E] dark:text-[#0A0F2E]' : 'text-slate-900 dark:text-slate-100'}`}>
                                {link.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-slate-300">
                                {link.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {resourcesLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => {
                                if (link.href !== '#') {
                                  setLocation(link.href);
                                }
                              }}
                              disabled={link.href === '#'}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{link.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-slate-300">
                                {link.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {companyLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => {
                                if (link.href !== '#') {
                                  setLocation(link.href);
                                }
                              }}
                              disabled={link.href === '#'}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{link.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-slate-300">
                                {link.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-slate-300" />
              )}
            </button>
            <Button
              variant="ghost"
              className="text-slate-700 hover:bg-slate-100"
              data-testid="button-sign-in"
              onClick={() => window.location.href = '/request-access'}
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-to-r from-[#0A0F2E] to-[#141B45] hover:from-[#0A0F2E] hover:to-[#141B45] text-white"
              onClick={() => setLocation('/demo-selector')}
              data-testid="button-get-started-nav"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700" data-testid="button-mobile-menu">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-200 w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Product */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Product</h3>
                    <ul className="space-y-2">
                      {productLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateAndClose(link.href);
                            }}
                            className="text-gray-600 hover:text-[#0A0F2E] block py-1"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Solutions</h3>
                    <ul className="space-y-2">
                      {solutionsLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateAndClose(link.href);
                            }}
                            className="text-gray-600 hover:text-[#0A0F2E] block py-1"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Resources</h3>
                    <ul className="space-y-2">
                      {resourcesLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="text-gray-600 hover:text-[#0A0F2E] block py-1"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Company</h3>
                    <ul className="space-y-2">
                      {companyLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="text-gray-600 hover:text-[#0A0F2E] block py-1"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-6 border-t border-slate-200">
                    <Button
                      variant="outline"
                      className="w-full border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white"
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-[#0A0F2E] to-[#141B45] hover:from-[#0A0F2E] hover:to-[#141B45] text-white"
                      onClick={() => navigateAndClose('/demo-selector')}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
