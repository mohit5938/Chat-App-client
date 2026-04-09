import React from 'react'


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

//Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);



import { lastSevenDays } from './../../lib/feature.js';
const getLastSevenDays = lastSevenDays();
const Linechart = ({value = []}) => {
  const data = {
    labels: getLastSevenDays,
    datasets: [
      {
        label: "chats %",
        data:value,
        borderColor: "#6366f1", 
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
        fill:true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
       grid:{
        display:false,
       }
      },
    },
  };

  return (
    <div className=" bg-white p-4 rounded-xl shadow">
      <h3 className="mb-2 font-semibold text-slate-700">
       chats
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

const Doughnutchart = ({value=[]}) => {
  const data = {
    labels: ["chat", "Group-chat"],
    datasets: [
      {
        label:"total chats vs Group chats",
        data: value,
        backgroundColor: ["#6366f1", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="  w-auto bg-white p-4 rounded-xl shadow ">
      <h3 className="mb-2 font-semibold text-slate-700 text-center">
       
      </h3>
      <Doughnut data={data} />
    </div>
  );
};

export {Linechart,Doughnutchart}
