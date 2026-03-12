import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('should render children correctly', () => {
    renderWithProviders(<Badge>Active</Badge>);
    
    const badgeElement = screen.getByText('Active');
    expect(badgeElement).toBeInTheDocument();
  });

  it('should apply default variant classes', () => {
    renderWithProviders(<Badge>Default Badge</Badge>);
    
    const badgeElement = screen.getByText('Default Badge');
    expect(badgeElement).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('should apply destructive variant classes correctly', () => {
    renderWithProviders(<Badge variant="destructive">Critical</Badge>);
    
    const badgeElement = screen.getByText('Critical');
    expect(badgeElement).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('should apply secondary variant classes correctly', () => {
    renderWithProviders(<Badge variant="secondary">Secondary</Badge>);
    
    const badgeElement = screen.getByText('Secondary');
    expect(badgeElement).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('should apply outline variant classes correctly', () => {
    renderWithProviders(<Badge variant="outline">Outline</Badge>);
    
    const badgeElement = screen.getByText('Outline');
    expect(badgeElement).toHaveClass('text-foreground');
  });

  it('should accept custom className', () => {
    renderWithProviders(<Badge className="custom-class">Custom</Badge>);
    
    const badgeElement = screen.getByText('Custom');
    expect(badgeElement).toHaveClass('custom-class');
  });

  it('should forward other HTML attributes', () => {
    renderWithProviders(<Badge data-testid="test-badge">Test</Badge>);
    
    const badgeElement = screen.getByTestId('test-badge');
    expect(badgeElement).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    renderWithProviders(<Badge>Status Badge</Badge>);
    
    const badgeElement = screen.getByText('Status Badge');
    expect(badgeElement.tagName).toBe('DIV');
    expect(badgeElement).toHaveClass('inline-flex', 'items-center', 'rounded-full');
  });
});