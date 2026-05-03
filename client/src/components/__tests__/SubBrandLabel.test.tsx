import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { SubBrandLabel, isSubBrand, SUB_BRAND_NAMES } from '../SubBrandLabel';

vi.mock('@/components/VaughnMartinLogo', () => ({
  VaughnMartinLogo: ({ variant, height }: any) => (
    <div data-testid="vm-logo" data-variant={variant} data-height={height} />
  ),
}));

describe('SUB_BRAND_NAMES constant', () => {
  it('contains exactly 4 sub-brand names', () => {
    expect(SUB_BRAND_NAMES).toHaveLength(4);
  });

  it('includes "Readiness Protocol™"', () => {
    expect(SUB_BRAND_NAMES).toContain('Readiness Protocol™');
  });

  it('includes "Signal™"', () => {
    expect(SUB_BRAND_NAMES).toContain('Signal™');
  });

  it('includes "Compass™"', () => {
    expect(SUB_BRAND_NAMES).toContain('Compass™');
  });

  it('includes "Retrospect™"', () => {
    expect(SUB_BRAND_NAMES).toContain('Retrospect™');
  });

  it('all entries include the ™ trademark symbol', () => {
    for (const name of SUB_BRAND_NAMES) {
      expect(name, `"${name}" should include ™`).toContain('™');
    }
  });
});

describe('isSubBrand()', () => {
  it('returns true for "Readiness Protocol™"', () => {
    expect(isSubBrand('Readiness Protocol™')).toBe(true);
  });

  it('returns true for "Signal™"', () => {
    expect(isSubBrand('Signal™')).toBe(true);
  });

  it('returns true for "Compass™"', () => {
    expect(isSubBrand('Compass™')).toBe(true);
  });

  it('returns true for "Retrospect™"', () => {
    expect(isSubBrand('Retrospect™')).toBe(true);
  });

  it('returns false for an unknown product name', () => {
    expect(isSubBrand('UnknownProduct')).toBe(false);
  });

  it('returns false for a retired brand name', () => {
    expect(isSubBrand('Phronex')).toBe(false);
    expect(isSubBrand('Kairosync')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isSubBrand('')).toBe(false);
  });

  it('is case-sensitive — lowercase match returns false', () => {
    expect(isSubBrand('signal™')).toBe(false);
    expect(isSubBrand('readiness protocol™')).toBe(false);
  });

  it('returns true for all names in SUB_BRAND_NAMES', () => {
    for (const name of SUB_BRAND_NAMES) {
      expect(isSubBrand(name), `isSubBrand("${name}") should be true`).toBe(true);
    }
  });
});

describe('SubBrandLabel component', () => {
  it('renders the provided name', () => {
    renderWithProviders(<SubBrandLabel name="Signal™" />);
    expect(screen.getByText('Signal™')).toBeInTheDocument();
  });

  it('renders the VaughnMartin logo icon', () => {
    renderWithProviders(<SubBrandLabel name="Compass™" />);
    expect(screen.getByTestId('vm-logo')).toBeInTheDocument();
  });

  it('passes "icon-only" variant to the logo', () => {
    renderWithProviders(<SubBrandLabel name="Retrospect™" />);
    const logo = screen.getByTestId('vm-logo');
    expect(logo.dataset.variant).toBe('icon-only');
  });

  it('uses default size of 14 when not specified', () => {
    renderWithProviders(<SubBrandLabel name="Signal™" />);
    const logo = screen.getByTestId('vm-logo');
    expect(Number(logo.dataset.height)).toBe(14);
  });

  it('accepts a custom size prop', () => {
    renderWithProviders(<SubBrandLabel name="Signal™" size={20} />);
    const logo = screen.getByTestId('vm-logo');
    expect(Number(logo.dataset.height)).toBe(20);
  });

  it('accepts and applies a custom className', () => {
    renderWithProviders(<SubBrandLabel name="Signal™" className="my-class" />);
    const span = screen.getByText('Signal™').closest('span');
    expect(span).toHaveClass('my-class');
  });

  it('renders as an inline-flex element', () => {
    renderWithProviders(<SubBrandLabel name="Readiness Protocol™" />);
    const span = screen.getByText('Readiness Protocol™').closest('span');
    expect(span).toHaveClass('inline-flex');
  });

  it('renders correctly for all 4 sub-brand names', () => {
    for (const name of SUB_BRAND_NAMES) {
      const { unmount } = renderWithProviders(<SubBrandLabel name={name} />);
      expect(screen.getByText(name)).toBeInTheDocument();
      unmount();
    }
  });
});
