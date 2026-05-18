import { useDemoController } from '@/contexts/DemoController';
import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function PeerAdoptionOverlay() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState(0);

  useEffect(() => {
    if (demoController.state.currentExecutiveStep === 3) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
      setVisibleCompanies(0);
    }
  }, [demoController.state.currentExecutiveStep]);

  useEffect(() => {
    if (!show) return;
    
    const interval = setInterval(() => {
      setVisibleCompanies(prev => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const adoptingCompanies = [
    { name: 'Major Healthcare System', role: 'CEO', industry: 'Healthcare', employees: '147K' },
    { name: 'Global Financial Services', role: 'COO', industry: 'Finance', employees: '89K' },
    { name: 'Tech Manufacturing Giant', role: 'CTO', industry: 'Manufacturing', employees: '203K' },
    { name: 'Fortune 100 Retailer', role: 'CHRO', industry: 'Retail', employees: '312K' },
    { name: 'International Bank', role: 'CRO', industry: 'Finance', employees: '156K' },
    { name: 'Pharmaceutical Leader', role: 'CFO', industry: 'Healthcare', employees: '91K' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <Card className="relative w-[950px] bg-gradient-to-br  border-[#2B8A6E]/50 p-8 animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-[#0A0F2E]/30">
                <Users className="h-8 w-8 text-[#0A0F2E]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A0F2E]">While You're Deciding...</h2>
            </div>
            <p className="text-xl text-[#0A0F2E]/90">Your enterprise peers are already executing</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0A0F2E]/20 p-4 border border-[#2B8A6E]/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DFC178]">847</p>
                <p className="text-[#0A0F2E] text-sm mt-1">startup to Fortune 500 Executives</p>
              </div>
            </div>
            <div className="bg-[#0A0F2E]/20 p-4 border border-[#2B8A6E]/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DFC178]">12 min</p>
                <p className="text-[#0A0F2E] text-sm mt-1">Average Response Time</p>
              </div>
            </div>
            <div className="bg-[#0A0F2E]/20 p-4 border border-[#2B8A6E]/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DFC178]">94%</p>
                <p className="text-[#0A0F2E] text-sm mt-1">Crisis Success Rate</p>
              </div>
            </div>
          </div>

          {/* Recently Adopted */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#0A0F2E]" />
              <p className="text-[#0A0F2E] font-semibold">Adopted in the Last 30 Days</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {adoptingCompanies.map((company, idx) => (
                <div
                  key={idx}
                  className={`bg-black/40 p-4 border border-[#2B8A6E]/30 transition-all duration-500 ${
                    idx < visibleCompanies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#0A0F2E]/30 rounded">
                      <Building2 className="h-4 w-4 text-[#0A0F2E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[#0A0F2E] font-semibold text-sm truncate">{company.name}</p>
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#DFC178]">
                        <span>{company.role}</span>
                        <span>•</span>
                        <span>{company.industry}</span>
                        <span>•</span>
                        <span>{company.employees} employees</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Message */}
          <div className="bg-gradient-to-r from-[#0A0F2E]/30 to-[#141B45]/30 p-5 border border-[#2B8A6E]/40">
            <div className="text-center space-y-2">
              <p className="text-[#0A0F2E] text-xl font-bold">
                They Had the Same Doubts You Do
              </p>
              <p className="text-[#0A0F2E]/80 text-lg">
                Now they're responding to crises 6x faster than their competitors
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
