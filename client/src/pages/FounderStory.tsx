import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Clock, ArrowLeft, User } from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import FounderStoryIntro from "@/components/marketing/FounderStoryIntro";
import FounderStoryFull from "@/components/marketing/FounderStoryFull";

export default function FounderStory() {
  const [activeVideo, setActiveVideo] = useState<"none" | "intro" | "full">("none");

  const handleVideoComplete = () => {
    setActiveVideo("none");
  };

  if (activeVideo === "intro") {
    return (
      <div className="min-h-screen bg-slate-950">
        <StandardNav />
        <FounderStoryIntro onComplete={handleVideoComplete} onSkip={handleVideoComplete} />
      </div>
    );
  }

  if (activeVideo === "full") {
    return (
      <div className="min-h-screen bg-slate-950">
        <StandardNav />
        <FounderStoryFull onComplete={handleVideoComplete} onSkip={handleVideoComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <StandardNav />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-6">
                <User className="h-4 w-4" />
                Meet the Founder
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                The Story Behind ExecuteIQ
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                20 years of Fortune 500 experience. 5 years coaching major college football. 
                One mission: eliminate the chaos between strategy and execution.
              </p>
            </motion.div>
          </div>

          {/* Video Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* 90-Second Intro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 to-transparent" />
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 dark:bg-amber-400/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">90</span>
                  <span className="text-lg text-amber-600/70 dark:text-amber-400/70 ml-2">seconds</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Quick Intro
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  The 72-hour problem, the football insight, and why ExecuteIQ exists. 
                  Perfect for a quick overview.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">~90 seconds</span>
                  </div>
                  <Button 
                    onClick={() => setActiveVideo("intro")}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Full Story */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 dark:from-emerald-900/30 dark:to-cyan-900/30 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">3:30</span>
                  <span className="text-lg text-emerald-600/70 dark:text-emerald-400/70 ml-2">minutes</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  The Full Story
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  The complete narrative: McKinsey research, Fortune 500 experiences, 
                  the IDEA framework, and the vision for strategic execution.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">~3:30 minutes</span>
                  </div>
                  <Button 
                    onClick={() => setActiveVideo("full")}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Founder Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Founder Info */}
              <div className="md:col-span-1">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto md:mx-0 mb-6">
                  <span className="text-4xl font-bold text-white">MB</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center md:text-left">
                  Marty Brunke
                </h3>
                <p className="text-amber-600 dark:text-amber-400 font-medium text-center md:text-left">
                  Founder & CEO
                </p>
              </div>

              {/* Experience */}
              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Fortune 500 Experience
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {[
                    "Boyd Gaming",
                    "Ford",
                    "Toyota",
                    "Vantiv/Worldpay",
                    "Lockheed Martin",
                    "Eli Lilly"
                  ].map((company) => (
                    <div 
                      key={company}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 text-center"
                    >
                      {company}
                    </div>
                  ))}
                </div>

                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  The Unique Perspective
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  After 20 years navigating crises, transformations, and strategic initiatives 
                  across gaming, automotive, financial services, aerospace, and pharma—and 5 years 
                  coaching major college football—Marty saw a pattern that no one was solving.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">The insight:</span> In football, 
                  you'd never run a play without practicing it. But in business, organizations improvise 
                  their most critical moments. ExecuteIQ brings the discipline of championship execution 
                  to enterprise strategy.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <blockquote className="text-2xl md:text-3xl font-light text-slate-700 dark:text-slate-300 italic max-w-4xl mx-auto">
              "Strategy is 10% of the work. Execution is 90%. 
              <span className="text-amber-600 dark:text-amber-400 font-medium"> ExecuteIQ is built for the 90%.</span>"
            </blockquote>
            <p className="text-slate-500 dark:text-slate-500 mt-4">— Marty Brunke</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
