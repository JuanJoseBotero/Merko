import axios from 'axios'
import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import IconChart from '../Images/dashboards.png'
import '../css/ViewDashboard.css'
import { Link, useNavigate} from 'react-router-dom';

interface Dashboard {
    id: number;
    name: string;
    date: string; 
    dashboard_diagrams: any[];
    api_information: any;  
};


export default function ViewDashboards() {

    const [dashboards, setDashboards] = useState<Dashboard[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboards = async () => {
        try {
            const username = localStorage.getItem("username");
            if (!username) {
            setError("No username found in localStorage");
            setLoading(false);
            return;
            }

            const response = await axios.get(
            `http://34.31.138.222:8000/api/analysis/dashboards/?username=${username}`
            );
            setDashboards(response.data);
            console.log("Fetched dashboards:");
            console.log(response.data);
        } catch (err) {
            setError("Error fetching dashboards");
        } finally {
            setLoading(false);
        }
        };
        fetchDashboards();
  }, []);

  const handleDashboardClick = (dashboard: any) => {
    const data = {
        id: dashboard.id,
        date: dashboard.date,
        name: dashboard.name,
        dashboard_diagrams: dashboard.diagrams,
        api_information: dashboard.api_information
    }
    console.log("Clicked dashboard:");
    console.log(dashboard);
    navigate(`/dashboard`, { state: { data } });
  }

  return (
    <div className='background-dashboard '>
        <div className='pb-30'>
            <div className='flex sm:flex-row justify-between items-center resposive-big-container flex-col'>
                <div className='space-y-7'>
                    <h1 className='heading-extrabig'>Your Dashboards</h1>
                    <h2 className='heading-2'>Click in each one to see more details</h2>
                </div>
                <div className=" w-full sm:w-auto flex justify-center">
                    <div className=" w-70 h-70 md:w-70 md:h-70 lg:w-90 lg:h-90 xl:w-110 xl:h-110">
                        <DotLottieReact
                        src="https://lottie.host/2439331e-9f14-474e-9c7e-c9f796849f6f/hHvgUm4j6j.lottie"
                        loop
                        autoplay
                        />
                    </div>
                </div>
            </div>
            <div className='grid place-items-center mx-15 sm:mx-25 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-auto gap-10'>
            {dashboards.map((dashboard, id) => (
                <div key={id} onClick={() => handleDashboardClick(dashboard)} className='bg-white p-5 items-center flex flex-col rounded-2xl shadow-md hover:shadow-lg cursor-pointer space-y-5'>
                    <img src={IconChart} alt="" className=' w-50 sm:w-70 lg:w-80' />
                    <h2 className='heading-3'>{dashboard.name}</h2>
                    <p className='body'> Created on: {new Date(dashboard.date).toLocaleDateString()}{" "}
                    </p>
                </div>
            ))}
            </div>
        </div>
    </div>
  )
}