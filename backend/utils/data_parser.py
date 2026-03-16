import pandas as pd
import numpy as np
from datetime import datetime

def validate_csv(df: pd.DataFrame):
    """
    Validates the uploaded CSV for forecasting.
    Expects roughly two columns: date and value.
    Returns processed dataframe and a preview of the first 5 rows.
    """
    # 1. Clean column names (strip whitespace, lowercase)
    df.columns = [col.strip().lower() for col in df.columns]
    
    # 2. Check for at least two columns
    if len(df.columns) < 2:
        raise ValueError("CSV must contain at least two columns: e.g., 'date' and 'value'.")
        
    # Assume first column is date and second is value if names don't match exactly
    date_col = 'date' if 'date' in df.columns else df.columns[0]
    # For value, find the first numeric column or default to second column
    value_col = None
    for col in df.columns:
        if col != date_col and pd.api.types.is_numeric_dtype(df[col]):
            value_col = col
            break
            
    if not value_col:
        value_col = df.columns[1] if len(df.columns) > 1 else 'value'

    # 3. Check minimum rows
    if len(df) < 30:
        raise ValueError(f"Minimum 30 rows required. Found {len(df)} rows.")

    # 4. Process Date and Value columns
    # Try converting date column
    try:
        df[date_col] = pd.to_datetime(df[date_col])
    except Exception as e:
        raise ValueError(f"Error parsing date column '{date_col}'. Please ensure it is in a standard date format.")

    # Try converting value column to numeric, coercing errors to NaN
    df[value_col] = pd.to_numeric(df[value_col], errors='coerce')
    
    # 5. Handle missing values
    # Forward fill missing values, then backward fill if first values are missing
    df[value_col] = df[value_col].ffill().bfill()
    
    # Sort by date
    df = df.sort_values(by=date_col).reset_index(drop=True)
    
    # Generate Preview
    preview = df.head(5).to_dict(orient='records')
    
    # Format data for returning as records (string format for dates)
    processed_df = pd.DataFrame({
        'date': df[date_col].dt.strftime('%Y-%m-%d'),
        'value': df[value_col]
    })
    
    return processed_df.to_dict(orient='records'), preview
