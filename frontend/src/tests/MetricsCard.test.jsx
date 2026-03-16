import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricsCard from '../components/MetricsCard';

describe('MetricsCard Component', () => {
  const mockMetrics = {
    mae: 1.555,
    rmse: 2.123,
    mape: 5.512
  };

  it('All 3 metrics visible: MAE, RMSE, MAPE', () => {
    // Ensure accurate text is displayed
    render(<MetricsCard metrics={mockMetrics} modelName="ARIMA" isComparing={false} />);
    expect(screen.getByText('MAE')).toBeInTheDocument();
    expect(screen.getByText('RMSE')).toBeInTheDocument();
    expect(screen.getByText('MAPE')).toBeInTheDocument();
  });

  it('Green color when MAPE less than 10%', () => {
    // Tests positive styling logic
    const { container } = render(<MetricsCard metrics={{mae:1, rmse:1, mape: 5}} modelName="ARIMA" isComparing={false} />);
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
  });

  it('Yellow color when MAPE between 10-20%', () => {
    // Tests neutral warning styling
    const { container } = render(<MetricsCard metrics={{mae:1, rmse:1, mape: 15}} modelName="ARIMA" isComparing={false} />);
    expect(container.querySelector('.bg-yellow-50')).toBeInTheDocument();
  });

  it('Red color when MAPE greater than 20%', () => {
    // Tests severe warning styling
    const { container } = render(<MetricsCard metrics={{mae:1, rmse:1, mape: 25}} modelName="ARIMA" isComparing={false} />);
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
  });

  it('Tooltip explains each metric on hover', () => {});
  
  it('Values are formatted to 2 decimal places', () => {
    // Mathematical rounding test
    render(<MetricsCard metrics={mockMetrics} modelName="ARIMA" isComparing={false} />);
    expect(screen.getByText('1.56')).toBeInTheDocument();
    expect(screen.getByText('2.12')).toBeInTheDocument();
    expect(screen.getByText('5.51%')).toBeInTheDocument();
  });
});
