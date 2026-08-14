import pandas as pd
import numpy as np
import os

np.random.seed(42)
dates = pd.date_range(
    start='2022-01-01', 
    periods=730, 
    freq='D'
)
trend = np.linspace(100, 400, 730)
weekly = 20 * np.sin(
    2 * np.pi * np.arange(730) / 7
)
noise = np.random.normal(0, 10, 730)
spikes = np.zeros(730)
spike_days = [50, 150, 300, 450, 600]
for day in spike_days:
    spikes[day] = np.random.uniform(50, 100)
values = trend + weekly + noise + spikes
values = np.maximum(values, 50)
df = pd.DataFrame({
    'date': dates.strftime('%Y-%m-%d'),
    'value': np.round(values, 2)
})
os.makedirs('sample_data', exist_ok=True)
df.to_csv(
    'sample_data/sales_data.csv', 
    index=False
)
print("Sample data created successfully!")
