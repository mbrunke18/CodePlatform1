import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Clock, Users, Building2, Briefcase, X } from 'lucide-react';
import { useDemoController } from '@/contexts/DemoController';

interface DemoConfigPanelProps {
  onClose: () => void;
  onStartDemo: () => void;
}

export default function DemoConfigPanel({ onClose, onStartDemo }: DemoConfigPanelProps) {
  const { setPersona, setIndustry } = useDemoController();
  
  const [selectedPreset, setSelectedPreset] = useState<string>('full');
  const [selectedPersona, setSelectedPersona] = useState<'ceo' | 'coo' | 'chro' | 'general'>('general');
  const [selectedIndustry, setSelectedIndustry] = useState<'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general'>('general');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showROI, setShowROI] = useState(true);

  // Demo presets with different time configurations
  const presets = {
    quick: {
      name: 'Quick Demo',
      duration: '2 minutes',
      description: 'Essential features for busy executives',
      icon: <Clock className="h-4 w-4" />,
      scenes: 5
    },
    standard: {
      name: 'Standard Demo',
      duration: '5 minutes',
      description: 'Comprehensive platform overview',
      icon: <Briefcase className="h-4 w-4" />,
      scenes: 7
    },
    full: {
      name: 'Full Experience',
      duration: '10 minutes',
      description: 'Complete interactive demonstration',
      icon: <Building2 className="h-4 w-4" />,
      scenes: 12
    },
    custom: {
      name: 'Custom Flow',
      duration: 'Variable',
      description: 'Tailor-made for specific needs',
      icon: <Settings className="h-4 w-4" />,
      scenes: 0
    }
  };

  const handleStartDemo = () => {
    // Apply configuration
    setPersona(selectedPersona);
    setIndustry(selectedIndustry);
    
    // Start demo with selected configuration
    onStartDemo();
  };

  return (
    <div 
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="demo-config-panel"
    >
      <Card className="bg-gray-900/98 border-blue-500/70 shadow-2xl backdrop-blur-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Demo Configuration</h2>
                <p className="text-gray-400 text-sm">Customize your presentation experience</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
              data-testid="config-close-btn"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Preset Selection */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">Demo Length</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="outline"
                  onClick={() => setSelectedPreset(key)}
                  className={`h-auto p-4 flex flex-col items-start justify-start space-y-2 ${
                    selectedPreset === key
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  data-testid={`preset-${key}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {preset.icon}
                    <span className="font-semibold">{preset.name}</span>
                  </div>
                  <div className="text-xs text-left space-y-1">
                    <div className="opacity-90">{preset.description}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {preset.duration}
                      </Badge>
                      {preset.scenes > 0 && (
                        <span className="opacity-75">{preset.scenes} scenes</span>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Persona Selection */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">Executive Persona</Label>
            <Select value={selectedPersona} onValueChange={(value: any) => setSelectedPersona(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-persona">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="general" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    General - All Executives
                  </div>
                </SelectItem>
                <SelectItem value="ceo" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    CEO - Strategic Leadership
                  </div>
                </SelectItem>
                <SelectItem value="coo" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    COO - Operational Excellence
                  </div>
                </SelectItem>
                <SelectItem value="chro" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    CHRO - People & Culture
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">Tailors narration and focus areas to specific executive priorities</p>
          </div>

          {/* Industry Selection */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">Industry Context</Label>
            <Select value={selectedIndustry} onValueChange={(value: any) => setSelectedIndustry(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="general" className="text-white hover:bg-gray-700">
                  General Enterprise
                </SelectItem>
                <SelectItem value="healthcare" className="text-white hover:bg-gray-700">
                  🏥 Healthcare & Life Sciences
                </SelectItem>
                <SelectItem value="finance" className="text-white hover:bg-gray-700">
                  💰 Financial Services
                </SelectItem>
                <SelectItem value="manufacturing" className="text-white hover:bg-gray-700">
                  🏭 Manufacturing
                </SelectItem>
                <SelectItem value="retail" className="text-white hover:bg-gray-700">
                  🛍️ Retail & E-Commerce
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">Shows crisis scenarios relevant to your industry</p>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <Label className="text-white font-semibold">Advanced Options</Label>
            
            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
              <div>
                <div className="text-white text-sm font-medium">Auto-advance scenes</div>
                <div className="text-gray-400 text-xs">Automatically progress through demo</div>
              </div>
              <Switch 
                checked={autoAdvance} 
                onCheckedChange={setAutoAdvance}
                data-testid="switch-auto-advance"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
              <div>
                <div className="text-white text-sm font-medium">Show ROI calculator</div>
                <div className="text-gray-400 text-xs">Display interactive value proposition</div>
              </div>
              <Switch 
                checked={showROI} 
                onCheckedChange={setShowROI}
                data-testid="switch-show-roi"
              />
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4">
            <Button 
              onClick={handleStartDemo}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-6 text-lg"
              data-testid="config-start-demo-btn"
            >
              Launch Personalized Demo
            </Button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Estimated duration: {presets[selectedPreset as keyof typeof presets].duration}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
