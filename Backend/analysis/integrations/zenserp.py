import requests

ZENSERP_API_KEY = "a37ab2c0-b8de-11f0-8560-bd7412745506"
BASE_URL = "https://app.zenserp.com/api/v1/trends"

def get_trends_data(keyword: str):
    """
    Realiza UNA sola solicitud a Zenserp Trends API y devuelve:
    - Promedio de popularidad en el tiempo.
    - Top 3 related queries.
    - País más popular.
    - Top 3 related topics.
    """

    params = {
        "q": keyword,
        "apikey": ZENSERP_API_KEY,
        "num": 10,  # número de resultados por categoría
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # --- 1️⃣ Popularity Over Time ---
        timeline_data = data.get("interest_over_time", {}).get("timeline_data", [])
        if timeline_data:
            values = [point["value"][0] for point in timeline_data if point["value"]]
            avg_popularity = sum(values) / len(values) if values else 0
        else:
            avg_popularity = None

        # --- 2️⃣ Related Queries (Top 3) ---
        related_queries = (
            [item["query"] for item in data.get("related_queries", [])[:3]]
            if "related_queries" in data
            else []
        )

        # --- 3️⃣ Popularity by Region ---
        regions = data.get("interest_by_region", {}).get("geo_data", [])
        top_region = regions[0]["geoName"] if regions else None

        # --- 4️⃣ Related Topics (Top 3) ---
        related_topics = (
            [item["topic_title"] for item in data.get("related_topics", [])[:3]]
            if "related_topics" in data
            else []
        )

        # Resultado combinado (1 sola request)
        return {
            "keyword": keyword,
            "average_popularity": avg_popularity,
            "top_related_queries": related_queries,
            "top_region": top_region,
            "top_related_topics": related_topics,
        }

    except requests.exceptions.RequestException as e:
        return {"keyword": keyword, "error": str(e)}
    except Exception as e:
        return {"keyword": keyword, "error": f"Unexpected error: {e}"}


# Ejemplo de ejecución directa
if __name__ == "__main__":
    result = get_trends_data("Coffee")
    print(result)
