import Link from "next/link"

export default function Sidebar(){

  return(

    <div className="w-64 bg-gray-900 text-white h-screen p-5">

      <h2 className="text-xl font-bold mb-6">
        HR Admin
      </h2>

      <nav className="flex flex-col gap-3">

        <Link href="/dashboard">Dashboard</Link>

        <Link href="/dashboard/employees">
        Employees
        </Link>

        <Link href="/dashboard/departments">
        Departments
        </Link>

        <Link href="/dashboard/attendance">
        Attendance
        </Link>

        <Link href="/dashboard/payroll">
        Payroll
        </Link>

      </nav>

    </div>

  )
}