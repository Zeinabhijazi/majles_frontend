"use client";
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchStatus } from "@/redux/slices/dashboardSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UsersLineChart() {
  const t = useTranslations('dashboard');
  const { orderStatus } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(()=> {
      dispatch(fetchStatus());
    },[dispatch])

  const data = {
    labels: [t('accepted'), t('pending'), t('cancelled')], // x-axis labels
    datasets: [
      {
        label: "orders", 
        data: [orderStatus.accepted, orderStatus.pending, orderStatus.cancelled ],
        borderColor: "#36A2EB",
        backgroundColor: ["#242329", "#212b36", "#e72544"],
        tension: 0.4, // curve the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t('userOverview'),
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} height={'215px'}/>
    </div>
  );
}
