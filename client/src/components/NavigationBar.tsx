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
    { title: "Mission Control", href: "/mission-control", description: "Executive readiness command center", featured: true },
    { title: "Readiness Protocol Library", href: "/playbook-library", description: "180 pre-staged Readiness Protocols across 9 strategic domains" },
    { title: "12-Minute Test Drive", href: "/12-minute-experience", description: "4-step live simulation of 12-minute execution" },
    { title: "ROI Calculator", href: "/calculator", description: "Quantify your readiness head start" },
  ];

  const solutionsLinks = [
    { title: "For the COO", href: "/demo-selector", description: "Execution orchestration at enterprise scale" },
    { title: "For the CFO", href: "/demo-selector", description: "Pre-staged budget authority and cost controls" },
    { title: "For the CTO / CIO", href: "/demo-selector", description: "Microsoft stack orchestration layer" },
    { title: "For the CEO", href: "/demo-selector", description: "Strategic trigger detection and decision authority" },
  ];

  const demoLinks = [
    { title: "Full Scenario Experience Center", href: "/demo-hub", description: "12 simulations across Growth · Risk · Transformation — the most realistic platform demo in enterprise SaaS.", featured: true },
    { title: "Master Demo — Activist Investor", href: "/master-demo", description: "Elliott Management files 13D at 2:47 AM — the definitive 7-phase platform walkthrough.", featured: true },
    { title: "Growth — Competitor Displacement Sprint", href: "/demo/market-entry", description: "Competitor files Chapter 11. 1,400 accounts in-play. 72-hour window before Salesforce moves." },
    { title: "Growth — M&A Rapid Response", href: "/demo/acquisition", description: "Acquisition target surfaces. LOI required in 48 hours. Three buyers already in conversations." },
    { title: "Transformation — Go-to-Market Acceleration", href: "/demo/product-launch", description: "Competitor announces launch in 30 days. Board authorizes 6-week pull-forward. GTM mobilizes in 12 minutes." },
    { title: "Transformation — Workforce Realignment", href: "/demo/workforce", description: "Board approves 16% realignment — 6,720 roles, 12 countries. WARN Act. 48 hours to execute." },
    { title: "Risk — Financial Services Ransomware", href: "/demo/ransomware", description: "Trading systems encrypted at 4:23 AM. SWIFT offline. Protocol #23 activates." },
    { title: "Risk — Pharmaceutical FDA Recall", href: "/demo/pharma", description: "Class I recall. 340,000 units distributed. 72-hour regulatory window." },
    { title: "Risk — Manufacturing Supplier Failure", href: "/demo/supply-chain", description: "Primary supplier files Chapter 11. 60% of Q3 production at risk." },
    { title: "Risk — Technology Data Breach", href: "/demo/data-breach", description: "2.3M records on dark web. GDPR 72-hour clock running." },
    { title: "Risk — General Counsel DOJ Investigation", href: "/demo/regulatory", description: "Civil Investigative Demand received. Litigation hold must issue today." },
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
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateAndClose('/')}
            data-testid="nav-logo"
          >
            <div className="w-10 h-10 bg-white dark:bg-slate-100 flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-xl">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Readiness OS</span>
              <span className="text-xs block text-gray-600 dark:text-slate-300">Situational Readiness Platform</span>
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
                              className={`w-full text-left block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors ${
                                (link as any).featured 
                                  ? 'bg-gradient-to-r from-[#0A0F2E] dark:from-[#0A0F2E] to-[#141B45] dark:to-[#141B45] hover:from-[#F8F7F4] dark:hover:from-[#0A0F2E] hover:to-[#141B45] dark:hover:to-[#141B45] border-2 border-[#E8E4DC] dark:border-[#0A0F2E]' 
                                  : 'hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E]'
                              }`}
                            >
                              <div className={`text-sm font-medium leading-none ${(link as any).featured ? 'text-[#0A0F2E] dark:text-[#0A0F2E] flex items-center gap-2' : 'text-slate-900 dark:text-slate-100'}`}>
                                {(link as any).featured && <span className="text-xs px-2 py-0.5 bg-[#0A0F2E] dark:bg-[#0A0F2E] text-white">NEW</span>}
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
                              className="w-full text-left block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E]"
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

                {/* Demos */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-gray-50 font-semibold">
                    Demos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[480px] gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {demoLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => setLocation(link.href)}
                              className={`w-full text-left block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors ${
                                (link as any).featured
                                  ? 'bg-[#0A0F2E] border border-[#C9A84C]/30'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200'
                              }`}
                            >
                              <div className={`text-sm font-semibold leading-none ${(link as any).featured ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                {link.title}
                              </div>
                              <p className={`line-clamp-2 text-sm leading-snug mt-1 ${(link as any).featured ? 'text-[#C9A84C]' : 'text-gray-500 dark:text-slate-400'}`}>
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
                              className="w-full text-left block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E] disabled:opacity-50 disabled:cursor-not-allowed"
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
                              className="w-full text-left block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-[#0A0F2E] dark:hover:bg-slate-700 hover:text-[#0A0F2E] dark:hover:text-[#0A0F2E] focus:bg-[#0A0F2E] dark:focus:bg-slate-700 focus:text-[#0A0F2E] dark:focus:text-[#0A0F2E] disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              onClick={() => setLocation('/try-demo')}
              data-testid="button-get-started-nav"
            >
              See a Demo
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

                  {/* Demos */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Demos</h3>
                    <ul className="space-y-2">
                      {demoLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateAndClose(link.href);
                            }}
                            className={`block py-1 font-medium ${(link as any).featured ? 'text-[#0A0F2E]' : 'text-gray-600 hover:text-[#0A0F2E]'}`}
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
