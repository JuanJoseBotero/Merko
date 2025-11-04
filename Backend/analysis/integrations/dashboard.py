from .comtrade import get_top10
from .data import get_trade_partners
from .world_bank import get_economic_indicators
import pycountry
import pandas as pd

def get_dashboard(cmd_code: str):
    try:
        # Top 10 importadores
        df_imports = get_top10(cmd_code, flow_code="M")
        top1_imports = df_imports.iloc[0]["Country"] if not df_imports.empty else None
        # print(df_imports)
        # print(top1_imports)

        # Top 10 exportadores
        df_exports = get_top10(cmd_code, flow_code="X")
        top1_exports = df_exports.iloc[0]["Country"] if not df_exports.empty else None
        # print(df_exports)
        # print(top1_exports)

        # Indicadores económicos
        import_country_iso = df_imports.iloc[0]["reporterISO"]
        export_country_iso = df_exports.iloc[0]["reporterISO"]
        print(import_country_iso)
        print(export_country_iso)

        indicators_import = (
            get_economic_indicators(import_country_iso)
            if import_country_iso
            else None
        )
        indicators_export = (
            get_economic_indicators(export_country_iso)
            if export_country_iso
            else None
        )

        # Socios comerciales
        import_country_code = df_imports.iloc[0]["reporterCode"]
        export_country_code = df_exports.iloc[0]["reporterCode"]
        print(import_country_code)
        print(export_country_code)

        partners_import = get_trade_partners(import_country_code, "M")
        partners_export = get_trade_partners(export_country_code, "X")
        # print(partners_import)
        # print(partners_export)

        # Combinar toda la información
        return {
            "product_code": cmd_code,
            "imports": {
                "top10": df_imports.to_dict(orient="records"),
                "top_country": top1_imports,
                "economic_context": indicators_import,
                "partners": partners_import,
            },
            "exports": {
                "top10": df_exports.to_dict(orient="records"),
                "top_country": top1_exports,
                "economic_context": indicators_export,
                "partners": partners_export,
            },
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    cmd_code = "0901"
    a = get_dashboard(cmd_code)
    print(a)
    