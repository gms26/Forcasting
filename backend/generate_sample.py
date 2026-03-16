import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

def generate_sample_data():
    start_date = datetime(2022, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(730)]  # 2 years
    
    # Base trend (upward)
    base = np.linspace(100, 300, 730)
    
    # Weekly seasonality
    # e.g. higher on weekends
    seasonal = []
    for d in dates:
        if d.weekday() >= 5: # Sat, Sun
            seasonal.append(50)
        else:
            seasonal.append(10)
            
    # Add some random noise
    noise = np.random.normal(0, 15, 730)
    
    # Create a few spikes
    spikes = np.zeros(730)
    spike_indices = np.random.choice(730, size=10, replace=False)
    for idx in spike_indices:
        spikes[idx] = np.random.uniform(50, 150)
        
    values = base + seasonal + noise + spikes
    values = np.maximum(values, 0) # Ensure no negative sales
    
    df = pd.DataFrame({
        'date': dates,
        'value': values.round(2)
    })
    
    os.makedirs('../sample_data', exist_ok=True)
    df.to_csv('../sample_data/sales_data.csv', index=False)
    print("Sample data generated!")

if __name__ == "__main__":
    generate_sample_data()
