import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { BrandStamp } from '../BrandStamp';

vi.mock('@/components/ExecuteIQLogo', () => ({
  ExecuteIQLogo: ({ variant, width, height, color }: any) => (
    <div
      data-testid="execute-iq-logo"
      data-variant={variant}
      data-width={width}
      data-height={height}
      data-color={color}
    />
  ),
}));

vi.mock('@/components/VaughnMartinLogo', () => ({
  VaughnMartinLogo: ({ variant, height }: any) => (
    <div data-testid="vaughn-martin-logo" data-variant={variant} data-height={height} />
  ),
}));

describe('BrandStamp', () => {
  describe('variant: logo (default)', () => {
    it('renders without crashing', () => {
      renderWithProviders(<BrandStamp />);
      expect(screen.getByTestId('execute-iq-logo')).toBeInTheDocument();
    });

    it('passes variant="full" to ExecuteIQLogo', () => {
      renderWithProviders(<BrandStamp variant="logo" />);
      const logo = screen.getByTestId('execute-iq-logo');
      expect(logo.dataset.variant).toBe('full');
    });

    it('passes color="navy" to ExecuteIQLogo', () => {
      renderWithProviders(<BrandStamp variant="logo" />);
      const logo = screen.getByTestId('execute-iq-logo');
      expect(logo.dataset.color).toBe('navy');
    });
  });

  describe('variant: icon', () => {
    it('renders ExecuteIQLogo in icon-only mode', () => {
      renderWithProviders(<BrandStamp variant="icon" />);
      const logo = screen.getByTestId('execute-iq-logo');
      expect(logo.dataset.variant).toBe('icon-only');
    });
  });

  describe('variant: dual', () => {
    it('renders ExecuteIQLogo and "by VaughnMartin" attribution', () => {
      renderWithProviders(<BrandStamp variant="dual" />);
      expect(screen.getByTestId('execute-iq-logo')).toBeInTheDocument();
      expect(screen.getByText('by VaughnMartin')).toBeInTheDocument();
    });
  });

  describe('variant: watermark', () => {
    it('renders ExecuteIQLogo in watermark mode', () => {
      renderWithProviders(<BrandStamp variant="watermark" />);
      expect(screen.getByTestId('execute-iq-logo')).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('sm size passes smaller height', () => {
      renderWithProviders(<BrandStamp size="sm" />);
      const logo = screen.getByTestId('execute-iq-logo');
      expect(Number(logo.dataset.height)).toBeLessThan(40);
    });

    it('xl size passes largest height', () => {
      renderWithProviders(<BrandStamp size="xl" />);
      const logo = screen.getByTestId('execute-iq-logo');
      expect(Number(logo.dataset.height)).toBeGreaterThan(50);
    });

    it('xl height is greater than sm height', () => {
      const { unmount } = renderWithProviders(<BrandStamp size="xl" />);
      const xlLogo = screen.getByTestId('execute-iq-logo');
      const xlHeight = Number(xlLogo.dataset.height);
      unmount();

      renderWithProviders(<BrandStamp size="sm" />);
      const smLogo = screen.getByTestId('execute-iq-logo');
      const smHeight = Number(smLogo.dataset.height);

      expect(xlHeight).toBeGreaterThan(smHeight);
    });
  });

  describe('align prop', () => {
    it('applies justify-start class for align="left"', () => {
      const { container } = renderWithProviders(<BrandStamp align="left" />);
      expect(container.firstChild).toHaveClass('justify-start');
    });

    it('applies justify-center class for align="center" (default)', () => {
      const { container } = renderWithProviders(<BrandStamp />);
      expect(container.firstChild).toHaveClass('justify-center');
    });

    it('applies justify-end class for align="right"', () => {
      const { container } = renderWithProviders(<BrandStamp align="right" />);
      expect(container.firstChild).toHaveClass('justify-end');
    });
  });

  describe('className prop', () => {
    it('forwards custom className to wrapper', () => {
      const { container } = renderWithProviders(<BrandStamp className="my-custom-class" />);
      expect(container.firstChild).toHaveClass('my-custom-class');
    });
  });
});
