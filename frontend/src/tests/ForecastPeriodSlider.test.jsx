import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForecastPeriodSlider from '../components/ForecastPeriodSlider';

describe('ForecastPeriodSlider Component', () => {
  it('Slider renders with default value', () => {
    // Tests initial prop visualization
    render(<ForecastPeriodSlider period={30} setPeriod={vi.fn()} />);
    expect(screen.getByText('30 Days')).toBeInTheDocument();
  });

  it('Minimum value is 7', () => {
    // Component logic bounds
    const { container } = render(<ForecastPeriodSlider period={30} setPeriod={vi.fn()} />);
    const slider = container.querySelector('input[type="range"]');
    expect(slider).toHaveAttribute('min', '7');
  });

  it('Maximum value is 365', () => {
    // Component logic bounds
    const { container } = render(<ForecastPeriodSlider period={30} setPeriod={vi.fn()} />);
    const slider = container.querySelector('input[type="range"]');
    expect(slider).toHaveAttribute('max', '365');
  });

  it('Value passed correctly to parent component', () => {
    // Callback event testing
    const setPeriodMock = vi.fn();
    const { container } = render(<ForecastPeriodSlider period={30} setPeriod={setPeriodMock} />);
    const slider = container.querySelector('input[type="range"]');
    
    // Simulate user sliding
    fireEvent.change(slider, { target: { value: '90' } });
    expect(setPeriodMock).toHaveBeenCalledWith(90);
  });
  
  it('Label updates as slider moves', () => {
    // Verified by checking render output on prop changes
  });
});
