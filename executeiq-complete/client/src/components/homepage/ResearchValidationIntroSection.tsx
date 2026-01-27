import { Card, CardContent } from "@/components/ui/card";

export default function ResearchValidationIntroSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-background shadow-lg" data-testid="card-research-validation-intro">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-research-validation-headline">
                Modern Research Confirms What Football Knew All Along
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-research-validation-description">
                For 100+ years, championship football teams have executed with precision. 
                Recent business research finally explains <strong>WHY</strong> this matters—and proves the 
                same coordination crisis exists in corporate America.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
