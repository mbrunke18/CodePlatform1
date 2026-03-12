import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FootballConnectionCalloutProps {
  text: string;
  testId?: string;
}

export default function FootballConnectionCallout({ text, testId = "callout-football-connection" }: FootballConnectionCalloutProps) {
  return (
    <Card className="mt-6 border-2 border-green-500/30 bg-green-50 dark:bg-green-900/10" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Badge className="bg-green-600 text-white shrink-0 mt-1" data-testid={`${testId}-badge`}>
            🏈 The Connection
          </Badge>
          <p className="text-base text-foreground leading-relaxed" data-testid={`${testId}-text`}>
            {text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
