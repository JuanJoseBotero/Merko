import comtradeapicall
import pandas as pd

def get_trade_partners(country_code: str, flow_code: str):
    """
    Devuelve los 10 principales socios comerciales (importadores o exportadores)
    para un país específico en un año dado.
    
    Parámetros:
        country_code (str): código ISO numérico del país (Colombia = 170)
        year (int): año del análisis
        flow_code (str): "M" para importaciones, "X" para exportaciones
    
    Retorna:
        dict con año, flujo y top 10 socios comerciales.
    """
    year = 2024


    try:
        # Llamada principal al endpoint de datos finales (no requiere API key si usas preview)
        df = comtradeapicall.previewFinalData(
            typeCode="C",
            freqCode="A",              # A = anual
            clCode="HS",
            period=str(year),
            reporterCode=country_code,
            cmdCode="TOTAL",           # TOTAL = todos los productos
            flowCode=flow_code,
            partnerCode=None,
            partner2Code=None,
            customsCode=None,
            motCode=None,
            maxRecords=5000,
            format_output="JSON",
            aggregateBy=None,
            breakdownMode="classic",
            countOnly=None,
            includeDesc=True
        )

        if df.empty:
            return {"error": "No trade data found"}

        # Agrupar por socio y sumar valores
        df_grouped = (
            df.groupby("partnerDesc")["primaryValue"]
            .sum()
            .sort_values(ascending=False)
            .head(10)
            .reset_index()
        )

        # Estructura de salida compatible con React
        return {
            "year": year,
            "flow": "Imports" if flow_code == "M" else "Exports",
            "partners": [
                {"name": row["partnerDesc"], "value": float(row["primaryValue"])}
                for _, row in df_grouped.iterrows()
            ]
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    s = get_trade_partners()
    print(s)