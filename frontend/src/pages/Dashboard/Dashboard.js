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
  const [preventiveMaintenanceStatusStats, setPreventiveMaintenanceStatusStats] = useState([])
  const [repairPriorityStats, setRepairPriorityStats] = useState([])
  const [preventiveMaintenancePriorityStats, setPreventiveMaintenancePriorityStats] = useState([])
  const [repairFailureReport, setRepairFailureReport] = useState([])
  const [performanceReport, setPerformanceReport] = useState([])
  const { user } = useAuthContext()


  const fetchRepairStatusStats = async () => {
    const response = await fetch('/api/dashboard/get-repair-status-stats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()
    console.log(json)
    if (response.ok) {
      let repairStatusStats = [json.incompleteRepairsCount, json.overdueRepairsCount, json.completedRepairsCount]
      setRepairStatusStats(repairStatusStats)
    }
  }

  const fetchPreventiveMaintenanceStatusStats = async () => {
    const response = await fetch('/api/dashboard/get-preventive-maintenance-status-stats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()
    console.log(json)
    if (response.ok) {
      let preventiveMaintenanceStatusStats = [json.incompletePreventiveMaintenancesCount, json.overduePreventiveMaintenancesCount, json.completedPreventiveMaintenancesCount]
      setPreventiveMaintenanceStatusStats(preventiveMaintenanceStatusStats)
    }
  }

  const fetchRepairPriorityStats = async () => {
    const response = await fetch('/api/dashboard/get-repair-priority-stats/', {
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

  const fetchPreventiveMaintenancePriorityStats = async () => {
    const response = await fetch('/api/dashboard/get-preventive-maintenance-priority-stats/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    console.log(json)
    if (response.ok) {
      let preventiveMaintenancePriorityStats = [json.lowPriorityRepairs, json.mediumPriorityRepairs, json.highPriorityRepairs]
      setPreventiveMaintenancePriorityStats(preventiveMaintenancePriorityStats)
    }
  }

  const fetchRepairFailueReport = async () => {
    console.log(user.token)
    const response = await fetch('/api/dashboard/get-repair-failure-report', {
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

  const fetchUsersAndTeamsPerformanceReport = async () => {
    const usersPerformanceReportResponse = await fetch('/api/dashboard/get-users-performance-report', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const teamsPerformanceReportResponse = await fetch('/api/dashboard/get-teams-performance-report', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    const usersPerformanceReportJson = await usersPerformanceReportResponse.json()
    const teamsPerformanceReportJson = await teamsPerformanceReportResponse.json()

    setPerformanceReport([...usersPerformanceReportJson, ...teamsPerformanceReportJson])


    // if (usersPerformanceReportJson.ok && teamsPerformanceReportJson.ok) {
    //   setPerformanceReport(json)
    // }
  }

  // const fetchTeamsPerformanceReportForRepair = async () => {
  //   const response = await fetch('/api/dashboard/get-teams-performance-report-for-repairs', {
  //     headers: {
  //       'Authorization': `Bearer ${user.token}`
  //     }
  //   })

  //   const json = await response.json()
  //   console.log(json)
  //   if (response.ok) {
  //     setRepairFailureReport(json)
  //   }
  // }

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

  const preventiveMaintenanceStatusStatsData = {
    labels: ['Incomplete', 'Overdue', 'Complete'],
    datasets: [
      {
        data: preventiveMaintenanceStatusStats,
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

  const preventiveMaintenancePriorityStatsData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: preventiveMaintenancePriorityStats,
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

  const failureReportColumnDefs = [
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

  const performanceReportColumnDefs = [
    {
      headerName: 'Assigned To',
      valueGetter: function (params) {
        const user = params.data.user
        const team = params.data.team
        if (user) {
          return user[0]
        }

        if (team) {
          return team[0]
        }
        return null
      }
    },
    {
      headerName: 'Total Repairs',
      field: 'totalRepairs'
    },
    {
      headerName: 'MTFR (In Hours)',
      field: 'mtfr'
    }

  ]

  useEffect(() => {
    fetchUsersAndTeamsPerformanceReport();
    fetchRepairStatusStats();
    fetchPreventiveMaintenanceStatusStats();
    fetchRepairPriorityStats();
    fetchPreventiveMaintenancePriorityStats();
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
                <Pie data={preventiveMaintenanceStatusStatsData} />
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
                <Doughnut data={preventiveMaintenancePriorityStatsData} />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='report-container'>
            <h1 className='report-title'>Failure Report</h1>
            <div className="ag-theme-alpine report">
              <AgGridReact
                rowData={repairFailureReport}
                columnDefs={failureReportColumnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          <div className='report-container'>
            <h1 className='report-title'>Users/Teams Performance Report</h1>
            <div className="ag-theme-alpine report">
              <AgGridReact
                rowData={performanceReport}
                columnDefs={performanceReportColumnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard