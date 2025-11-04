import requests

# PIB → NY.GDP.MKTP.CD
# Crecimiento PIB → NY.GDP.MKTP.KD.ZG
# Inflación → FP.CPI.TOTL.ZG
# Desempleo → SL.UEM.TOTL.ZS

BASE_URL = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}?format=json&per_page=1"

def get_economic_indicators(country: str = "COL"):
    """
    Devuelve indicadores económicos principales del país (último valor disponible).
    """
    indicators = {
        "GDP (current US$)": "NY.GDP.MKTP.CD",
        "GDP growth (%)": "NY.GDP.MKTP.KD.ZG",
        "Inflation (%)": "FP.CPI.TOTL.ZG",
        "Unemployment (%)": "SL.UEM.TOTL.ZS"
    }

    results = {"country": country, "data": {}}

    try:
        for name, code in indicators.items():
            url = BASE_URL.format(country=country, indicator=code)
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                if len(data) > 1 and len(data[1]) > 0:
                    value = data[1][0].get("value")
                    results["data"][name] = value
                else:
                    results["data"][name] = None
            else:
                results["data"][name] = None
    except Exception as e:
        results["error"] = str(e)

    return results



if __name__ == "__main__":
    r = get_economic_indicators()
    print(r)

