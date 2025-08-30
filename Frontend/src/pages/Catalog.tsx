import { Link } from 'react-router-dom'

export default function Catalog() {

    const prompts_catalog = [
        {
            title: "🧭  Import Analysis",
            description: "Identify where products come from, who imports them, in what volumes, and under what logistical conditions."
        },
        {
            title: "📈  Demand Analysis",
            description: "Analyze market behavior to predict trends, anticipate changes, and improve planning accuracy."
        },
        {
            title: "🚀  Growth Opportunities",
            description: "Identify new customers, categories, or markets with the potential to strategically scale your business."
        },
        {
            title: "👥 Customer Analysis",
            description: "Segment your customers, identify churn risks, and understand how they make purchasing decisions."
        },
        {
            title: "🏁 Competitive Analysis",
            description: "Gain key insights about your competitors: capabilities, investments, strategies, and market presence."
        },
        {
            title: "💰 Financial Analysis",
            description: "Interpret financial reports and find correlations between economic results and market movements."
        }
    ]
1
  return (
    <div className='space-y-8 resposive-big-container'>
      <h1 className='heading-1 font-bold'>New Analysis</h1>
      <div className='grid grid-cols-3 gap-4 responsive-grid'>
        {prompts_catalog.map( (prompt) => (
          <div className='bg-white p-8 rounded-2xl shadow flex flex-col justify-between gap-6' key={prompt.title}>
            <h2 className='heading-2'>{prompt.title}</h2>
            <p className='body'>{prompt.description}</p>
            <Link className='main-button ' to={"/s"}>Select</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
