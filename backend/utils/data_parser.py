import pandas as pd
import json
import io

def parse_data(file_content, is_json=False):
    try:
        if is_json:
            df = pd.DataFrame(file_content)
        else:
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8')))

        # Automatically detect date column
        date_col = None
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                date_col = col
                break
        
        # If no explicit name match, try converting columns to datetime
        if not date_col:
            for col in df.columns:
                try:
                    pd.to_datetime(df[col], format='mixed')
                    date_col = col
                    break
                except (ValueError, TypeError):
                    continue

        if not date_col:
            raise ValueError("Could not detect a date column.")

        # Detect value column
        val_col = None
        for col in df.columns:
            if col != date_col and pd.api.types.is_numeric_dtype(df[col]):
                val_col = col
                break

        if not val_col:
            raise ValueError("Could not detect a numeric value column.")

        df = df[[date_col, val_col]].rename(columns={date_col: 'date', val_col: 'value'})
        df['date'] = pd.to_datetime(df['date'])
        
        # Sort and fill
        df = df.sort_values('date')
        df['value'] = df['value'].ffill()

        if len(df) < 30:
            raise ValueError("Dataset must have at least 30 rows.")

        return df

    except Exception as e:
        raise ValueError(f"Error parsing data: {str(e)}")
