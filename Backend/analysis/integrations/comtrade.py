from datetime import date, timedelta
import comtradeapicall
import pandas as pd

# https://comtradeplus.un.org/

def get_top10(cmd_code: str, flow_code: str):
    months = [f"2025{str(m).zfill(2)}" for m in range(1, 10)]

    df = []

    for period in months:
        df_month = comtradeapicall.previewFinalData(
            typeCode="C",
            freqCode="M", # Mensual
            clCode="HS",
            period=period,
            reporterCode=None, # Todos los países
            cmdCode=cmd_code, # Código del producto
            flowCode=flow_code, # M = importaciones, X = exportaciones
            partnerCode="0", # Comercio con el mundo
            partner2Code=None,
            customsCode=None,
            motCode=None,
            maxRecords=500,
            format_output="JSON",
            includeDesc=True
        )

        if not df_month.empty:
            df_month = df_month[["reporterDesc", "reporterCode", "reporterISO", "primaryValue", "cmdDesc"]]
            df.append(df_month)
        else:
            print(f"⚠️ Sin datos disponibles para {period}")
        
    if not df:
        print("⚠️ No se encontraron datos para los meses solicitados.")
        return pd.DataFrame()
    
    df_concat = pd.concat(df, ignore_index=True)

    df_groupby = (
        df_concat
        .groupby(["reporterDesc", "reporterCode", "reporterISO", "cmdDesc"], as_index=False)
        .agg({"primaryValue": "sum"})
        .sort_values(by="primaryValue", ascending=False)
    )

    df_top10 = df_groupby.head(10)

    df_top10 = df_top10.rename(columns={
        "reporterDesc": "Country",
        "primaryValue": "Trade Value (US$)"
    })

    # print("##########")
    # print(df_top10)

    return df_top10




def prueba(cmd_code: str, flow_code: str):
    df_month = comtradeapicall.previewFinalData(
        typeCode="C",
        freqCode="M", # Mensual
        clCode="HS",
        period="202501",
        reporterCode=None, # Todos los países
        cmdCode=cmd_code, # Código del producto
        flowCode=flow_code, # M = importaciones, X = exportaciones
        partnerCode="0", # Comercio con el mundo
        partner2Code=None,
        customsCode=None,
        motCode=None,
        maxRecords=500,
        format_output="JSON",
        includeDesc=True
    )
    print(df_month.columns)
    return df_month

if __name__ == "__main__":
    cmd_code = "0901"
    flow_code = "M"
    get_top10(cmd_code, flow_code)

    
