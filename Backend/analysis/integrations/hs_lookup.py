import pandas as pd
from pathlib import Path

# Cargar el CSV una sola vez al iniciar
CSV_PATH = Path(__file__).resolve().parent / "harmonized-system.csv"
hs_df = pd.read_csv(CSV_PATH)

def search_hs_code(query: str, limit: int = 10):
    """Busca coincidencias por texto en la descripción."""
    if not query or len(query) < 2:
        return []
    
    results = hs_df[
        hs_df["description"].str.contains(query, case=False, na=False)
    ][["hscode", "description"]].head(limit)

    return results.to_dict(orient="records")
