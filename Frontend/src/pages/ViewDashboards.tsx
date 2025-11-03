import React from 'react'
import axios from 'axios'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import data from '../dashboards.json'
import IconChart from '../images/dashboards.png'
import '../css/ViewDashboard.css'


export default function ViewDashboards() {



  return (
    <div className='background-dashboard '>
      <div className='mb-100'>
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
          {data.map((dashboard, id) => (
              <div key={id} className='bg-white p-5 items-center flex flex-col rounded-2xl shadow-md hover:shadow-lg cursor-pointer space-y-5'>
                  <img src={IconChart} alt="" className=' w-50 sm:w-70 lg:w-80' />
                  <h2 className='heading-3'>{dashboard.name}</h2>
                  <p className='body'>{dashboard.date}</p>
              </div>
          ))}
          </div>
      </div>
    </div>
  )
}