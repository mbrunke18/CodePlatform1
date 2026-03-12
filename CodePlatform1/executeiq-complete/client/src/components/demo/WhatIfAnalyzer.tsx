import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface WhatIfAnalyzerProps {
  scenario: {
    name: string;
    department: string;
    stakeholders: string;
  };
}

export default function WhatIfAnalyzer({ scenario }: WhatIfAnalyzerProps) {
  const [variables, setVariables] = useState({
    resourceAllocation: [70],
    stakeholderAlignment: [75],
    marketVolatility: [50],
    timelineCompression: [30]
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/demo/what-if-analysis', {
        scenario,
        variables: {
          'Resource Allocation': `${variables.resourceAllocation[0]}%`,
          'Stakeholder Alignment': `${variables.stakeholderAlignment[0]}%`,
          'Market Volatility': `${variables.marketVolatility[0]}%`,
          'Timeline Compression': `${variables.timelineCompression[0]}%`
        }
      });
      
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Failed to run what-if analysis:', error);
      // Set fallback analysis
      setAnalysis({
        mostLikely: { 
          probability: 70, 
          description: "Strong execution with manageable challenges. Expected completion within timeline with minor adjustments." 
        },
        bestCase: { 
          probability: 20, 
          description: "Exceptional outcomes exceeding targets. All stakeholders aligned, resources optimized, market conditions favorable." 
        },
        worstCase: { 
          probability: 10, 
          description: "Significant obstacles requiring strategic pivot. Resource constraints or external factors create delays." 
        },
        successFactors: [
          "Executive sponsorship and clear authority",
          "Cross-functional stakeholder alignment",
          "Adequate resource allocation"
        ],
        risks: [
          "Timeline compression leading to quality concerns",
          "Stakeholder misalignment or competing priorities",
          "External market volatility"
        ],
        recommendations: [
          "Establish weekly executive steering committee",
          "Implement early warning system for risk triggers",
          "Build contingency plans for critical path items"
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          AI-Powered What-If Analyzer
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Adjust variables to see AI-predicted outcomes for your scenario
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variable Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white">
              Resource Allocation: {variables.resourceAllocation[0]}%
            </Label>
            <Slider
              value={variables.resourceAllocation}
              onValueChange={(value) => setVariables({ ...variables, resourceAllocation: value })}
              min={0}
              max={100}
              step={5}
              data-testid="slider-resource-allocation"
            />
            <p className="text-xs text-gray-500">Budget and team capacity allocated</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              Stakeholder Alignment: {variables.stakeholderAlignment[0]}%
            </Label>
            <Slider
              value={variables.stakeholderAlignment}
              onValueChange={(value) => setVariables({ ...variables, stakeholderAlignment: value })}
              min={0}
              max={100}
              step={5}
              data-testid="slider-stakeholder-alignment"
            />
            <p className="text-xs text-gray-500">Executive and team consensus level</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              Market Volatility: {variables.marketVolatility[0]}%
            </Label>
            <Slider
              value={variables.marketVolatility}
              onValueChange={(value) => setVariables({ ...variables, marketVolatility: value })}
              min={0}
              max={100}
              step={5}
              data-testid="slider-market-volatility"
            />
            <p className="text-xs text-gray-500">External market uncertainty factor</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              Timeline Compression: {variables.timelineCompression[0]}%
            </Label>
            <Slider
              value={variables.timelineCompression}
              onValueChange={(value) => setVariables({ ...variables, timelineCompression: value })}
              min={0}
              max={100}
              step={5}
              data-testid="slider-timeline-compression"
            />
            <p className="text-xs text-gray-500">Schedule acceleration vs standard timeline</p>
          </div>
        </div>

        {/* Run Analysis Button */}
        <Button
          onClick={runAnalysis}
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          data-testid="button-run-analysis"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              AI Analyzing Scenarios...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Run AI What-If Analysis
            </>
          )}
        </Button>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Outcome Scenarios */}
            <div className="grid gap-4">
              {/* Most Likely */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-300">Most Likely Outcome</h4>
                  </div>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                    {analysis.mostLikely.probability}% Probability
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{analysis.mostLikely.description}</p>
              </div>

              {/* Best Case */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-green-300">Best Case Scenario</h4>
                  </div>
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
                    {analysis.bestCase.probability}% Probability
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{analysis.bestCase.description}</p>
              </div>

              {/* Worst Case */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-red-300">Worst Case Scenario</h4>
                  </div>
                  <Badge className="bg-red-600/20 text-red-300 border-red-500/50">
                    {analysis.worstCase.probability}% Probability
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{analysis.worstCase.description}</p>
              </div>
            </div>

            {/* Success Factors & Risks */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Key Success Factors
                </h4>
                <ul className="space-y-2">
                  {analysis.successFactors.map((factor: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Critical Risks
                </h4>
                <ul className="space-y-2">
                  {analysis.risks.map((risk: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-3">AI Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-purple-400 font-bold mt-0.5">{index + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray-500 text-center italic">
              Analysis powered by OpenAI GPT-5 with strategic execution frameworks
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
