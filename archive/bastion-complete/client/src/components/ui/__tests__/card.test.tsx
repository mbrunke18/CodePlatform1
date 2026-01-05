import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render children correctly', () => {
      renderWithProviders(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should apply default card styling', () => {
      renderWithProviders(
        <Card data-testid="test-card">
          Card content
        </Card>
      );
      
      const cardElement = screen.getByTestId('test-card');
      expect(cardElement).toHaveClass('rounded-lg', 'border', 'bg-card');
    });

    it('should accept custom className', () => {
      renderWithProviders(
        <Card className="custom-card" data-testid="test-card">
          Content
        </Card>
      );
      
      const cardElement = screen.getByTestId('test-card');
      expect(cardElement).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('should render header content', () => {
      renderWithProviders(
        <Card>
          <CardHeader>
            <div>Header content</div>
          </CardHeader>
        </Card>
      );
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should apply header styling', () => {
      renderWithProviders(
        <CardHeader data-testid="card-header">
          Header
        </CardHeader>
      );
      
      const headerElement = screen.getByTestId('card-header');
      expect(headerElement).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });
  });

  describe('CardTitle', () => {
    it('should render title text', () => {
      renderWithProviders(
        <CardTitle>Strategic Analysis</CardTitle>
      );
      
      expect(screen.getByText('Strategic Analysis')).toBeInTheDocument();
    });

    it('should apply title styling', () => {
      renderWithProviders(
        <CardTitle data-testid="card-title">Title</CardTitle>
      );
      
      const titleElement = screen.getByTestId('card-title');
      expect(titleElement).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });
  });

  describe('CardDescription', () => {
    it('should render description text', () => {
      renderWithProviders(
        <CardDescription>Strategic intelligence analysis for Q4 2024</CardDescription>
      );
      
      expect(screen.getByText('Strategic intelligence analysis for Q4 2024')).toBeInTheDocument();
    });

    it('should apply description styling', () => {
      renderWithProviders(
        <CardDescription data-testid="card-description">Description</CardDescription>
      );
      
      const descElement = screen.getByTestId('card-description');
      expect(descElement).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('should render content', () => {
      renderWithProviders(
        <CardContent>
          <p>Card main content</p>
        </CardContent>
      );
      
      expect(screen.getByText('Card main content')).toBeInTheDocument();
    });

    it('should apply content styling', () => {
      renderWithProviders(
        <CardContent data-testid="card-content">Content</CardContent>
      );
      
      const contentElement = screen.getByTestId('card-content');
      expect(contentElement).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('should render footer content', () => {
      renderWithProviders(
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      );
      
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('should apply footer styling', () => {
      renderWithProviders(
        <CardFooter data-testid="card-footer">Footer</CardFooter>
      );
      
      const footerElement = screen.getByTestId('card-footer');
      expect(footerElement).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });

  describe('Complete Card Structure', () => {
    it('should render full card with all components', () => {
      renderWithProviders(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Acuetic Intelligence Report</CardTitle>
            <CardDescription>Strategic analysis for TechFlow Dynamics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Detailed intelligence analysis shows 85% confidence in market expansion opportunity.</p>
          </CardContent>
          <CardFooter>
            <button>View Details</button>
          </CardFooter>
        </Card>
      );
      
      // Verify all components are rendered
      expect(screen.getByText('Acuetic Intelligence Report')).toBeInTheDocument();
      expect(screen.getByText('Strategic analysis for TechFlow Dynamics')).toBeInTheDocument();
      expect(screen.getByText('Detailed intelligence analysis shows 85% confidence in market expansion opportunity.')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      
      // Verify structure
      const cardElement = screen.getByTestId('complete-card');
      expect(cardElement).toBeInTheDocument();
    });

    it('should maintain proper semantic structure', () => {
      renderWithProviders(
        <Card>
          <CardHeader>
            <CardTitle>Business Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            Strategic content here
          </CardContent>
        </Card>
      );
      
      const title = screen.getByText('Business Intelligence');
      const content = screen.getByText('Strategic content here');
      
      expect(title.tagName).toBe('H3');
      expect(content).toBeInTheDocument();
    });
  });
});