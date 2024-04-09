import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrevRouteContext } from "../../hooks/usePrevRouteContext";
import Chart from "chart.js/auto";
import { useAuthContext } from '../../hooks/useAuthContext'
import { Doughnut, Pie } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';

const Dashboard = () => {

  const location = useLocation()
  const { prevRoute, dispatch: prevRouterDispatch } = usePrevRouteContext()
  const [repairStatusStats, setRepairStatusStats] = useState([])
  const [repairPriorityStats, setRepairPriorityStats] = useState([])
  const [repairFailureReport, setRepairFailureReport] = useState([])
  const { user } = useAuthContext()


  const fetchRepairAndPreventiveStatusStats = async () => {
    const response = await fetch('/api/dashboard/getRepairStatusStats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      let repairStatusStats = [json.incompleteRepairsCount, json.overdueRepairsCount, json.completedRepairsCount]
      setRepairStatusStats(repairStatusStats)
    }
  }

  const fetchRepairAndPreventivePriorityStats = async () => {
    const response = await fetch('/api/dashboard/getRepairPriorityStats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    console.log(json)
    if (response.ok) {
      let repairPriorityStats = [json.lowPriorityRepairs, json.mediumPriorityRepairs, json.highPriorityRepairs]
      setRepairPriorityStats(repairPriorityStats)
    }
  }

  const fetchRepairFailueReport = async () => {
    console.log(user.token)
    const response = await fetch('/api/dashboard/getRepairFailureReport', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()
    console.log(json)
    if (response.ok) {
      setRepairFailureReport(json)
    }
  }

  const repairStatusStatsData = {
    labels: ['Incomplete', 'Overdue', 'Complete'],
    datasets: [
      {
        data: repairStatusStats,
        backgroundColor: ['#FFCE56', '#D10000', '#00A300'],
        hoverBackgroundColor: ['#FFCE56', '#D10000', '#00A300'],
      },
    ],
  };

  const repairPriorityStatsData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: repairPriorityStats,
        backgroundColor: ['#00A300', '#FFCE56', '#D10000'],
        hoverBackgroundColor: ['#00A300', '#FFCE56', '#D10000'],
      },
    ],
  };

  const defaultColDef = {
    flex: 1 // or 'autoWidth'
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };

  const columnDefs = [
    {
      headerName: 'Asset Name',
      field: 'asset'
    },
    {
      headerName: 'Total Failures',
      field: 'totalFailures'
    },
    {
      headerName: 'MTBF (In Hours)',
      field: 'mtbf'
    }

  ]

  useEffect(() => {
    fetchRepairAndPreventiveStatusStats();
    fetchRepairAndPreventivePriorityStats();
    fetchRepairFailueReport();
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
                <h2 className='chart-title'>Repairs Status</h2>
                <Pie data={repairStatusStatsData} />
              </div>
              <div className="workorder-stats-chart">
                <h2 className='chart-title'>Preventive Maintenances Status</h2>
                <Pie data={repairStatusStatsData} />
              </div>
            </div>
          </div>
          <div className='dashboard-item'>
            <div className='workorder-stats-charts-container'>
              <div className="workorder-stats-chart">
                <h2 className='chart-title'>Repairs Priority</h2>
                <Doughnut data={repairPriorityStatsData} />
              </div>
              <div className="workorder-stats-chart">
                <h2 className='chart-title'>Preventive Maintenances Priority</h2>
                <Doughnut data={repairPriorityStatsData} />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='failure-report-container'>
            <h1 className='failure-report-title'>Failure Report</h1>
            <div className="ag-theme-alpine failure-report">
              <AgGridReact
                rowData={repairFailureReport}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          <div className='dashboard-item'>

          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard