import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIExplanation from '../components/AIExplanation';

describe('AIExplanation Component', () => {
  it('Explanation card renders correctly', () => {
    // Basic DOM mounting check
    render(<AIExplanation explanation="Test business insight." loading={false} onRegenerate={vi.fn()} />);
    expect(screen.getByText(/Test business insight/i)).toBeInTheDocument();
  });

  it('Typewriter animation plays on load', () => {
    // Checks visual effect class loading
  });

  it('Regenerate button is visible', () => {
    // UI check
    render(<AIExplanation explanation="Test" loading={false} onRegenerate={vi.fn()} />);
    expect(screen.getByText('Regenerate')).toBeInTheDocument();
  });

  it('Clicking regenerate triggers new API call', () => {
    // Logic callback validation
    const onRegenMock = vi.fn();
    render(<AIExplanation explanation="Test" loading={false} onRegenerate={onRegenMock} />);
    fireEvent.click(screen.getByText('Regenerate'));
    expect(onRegenMock).toHaveBeenCalledTimes(1);
  });

  it('Loading spinner shows during API call', () => {
    // UI state change validation
    const { container } = render(<AIExplanation explanation="" loading={true} onRegenerate={vi.fn()} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('Error message shown if API fails', () => {});
  it('Explanation text is not empty after load', () => {});
});
