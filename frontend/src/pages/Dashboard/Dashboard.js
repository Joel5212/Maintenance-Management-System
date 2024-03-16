import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import Chart from "chart.js/auto";
import { useAuthContext } from '../../hooks/useAuthContext'
import { Pie } from 'react-chartjs-2';

const Dashboard = () => {

  const location = useLocation()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
  const [repairStats, setRepairStats] = useState([])
  const { user } = useAuthContext()


  const fetchRepairAndPreventiveStats = async () => {
    const response = await fetch('/api/dashboard/getRepairStats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      let repairStats = [json.incompleteRepairsCount, json.overdueRepairsCount, json.completedRepairsCount]
      setRepairStats(repairStats)
    }
  }

  const data = {
    labels: ['Incomplete', 'Overdue', 'Complete'],
    datasets: [
      {
        data: repairStats,
        backgroundColor: ['#FFCE56', '#D10000', '#00A300'],
        hoverBackgroundColor: ['#FFCE56', '#D10000', '#00A300'],
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };

  useEffect(() => {
    fetchRepairAndPreventiveStats();
    prevRouterDispatch({ type: 'SET_PREV_ROUTE', location: location.pathname })
  }, [])

  return (
    <div className='dashboard'>
      <div classNam className='dashboard-header'>
        <h1 className='dashboard-title'>Dashboard</h1>
        <hr className='dashboard-divider' />
      </div>
      <div className='dashboard-container'>
        <div className='row'>
          <div className='dashboard-item'>
            <div className='workorder-stats-charts-container'>
              <div className="workorder-stats-chart">
                <h2 className='chart-title'>Repairs</h2>
                <Pie data={data} />
              </div>
              <div className="workorder-stats-chart">
                <h2 className='chart-title'>Preventive Maintenances</h2>
                <Pie data={data} />
              </div>
            </div>
          </div>
          <div className='dashboard-item'>

          </div>
        </div>
        <div className='row'>
          <div className='dashboard-item'>

          </div>
          <div className='dashboard-item'>

          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard