from pytrends.request import TrendReq
import pandas as pd
import time, random

def get_interest(keyword: str) -> dict:
    pytrends = TrendReq(hl='en-US', tz=360)
    timeframe = "today 3-m"
    try: 
        time.sleep(random.uniform(5, 15))
        pytrends.build_payload(kw_list=[keyword], timeframe=timeframe, geo="CO")
        data = pytrends.interest_over_time()

        if data.empty:
            return {"keyword": keyword, "interest": None}

        avg_interest = round(data[keyword].mean(), 2)
        return {"keyword": keyword, "interest": avg_interest}
    except Exception as e:
        return {"keyword": keyword, "error": str(e)}

def get_topics(keyword: str) -> dict:
    time.sleep(random.uniform(5, 15))
    pytrends = TrendReq(hl='en-US', tz=360)
    pytrends.build_payload([keyword], geo="CO")
    topics = pytrends.related_topics()
    print(topics)
    # timeframe = "today 12-m"
    # try: 
    #     time.sleep(3)
    #     pytrends.build_payload([keyword], geo="CO")
    #     topics = pytrends.related_topics()
    #     print(topics)
        
    # except Exception as e:
    #     return {"keyword": keyword, "error": str(e)}


# def get_queries(keyword: str) -> dict:
#     timeframe = "today 12-m"
#     try: 
#         time.sleep(3)
#         pytrends.build_payload([keyword], cat=0, timeframe=timeframe, geo='', gprop='')
#         queries = pytrends.related_queries()
#         if keyword not in queries or 'top' not in queries[keyword]:
#             return {"keyword": keyword, "queries": []}

#         df = queries[keyword]['top']
#         top3 = df.head(3)[['query', 'value']].to_dict(orient='records')
#         return {"keyword": keyword, "queries": top3}

#     except Exception as e:
#         return {"keyword": keyword, "error": str(e)}

if __name__ == "__main__":
    i = get_interest("Banano")
    print(i)
