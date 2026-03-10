export default function DashboardPage(){

  return(

    <div>

      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 shadow rounded">
          Total Employees
        </div>

        <div className="bg-white p-4 shadow rounded">
          Departments
        </div>

        <div className="bg-white p-4 shadow rounded">
          Attendance
        </div>

        <div className="bg-white p-4 shadow rounded">
          Payroll
        </div>

      </div>

    </div>
  )
}