import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mountain, Mail, User, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Hydraulic Operations',
    designation: '',
    reason: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="h-12 w-12 bg-sky-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-lg mb-4">
          <Mountain className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          HILL<span className="text-sky-400">WATER</span>
        </h1>
        <p className="mt-1 text-xs text-sky-300 font-medium tracking-wide uppercase">
          New Personnel Clearance Request
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Request Submitted</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your credentials request has been forwarded to the Water Operations Administrator. Demo access granted immediately for evaluation.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Officer Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@wateroperations.demo"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Hydraulic Operations">Hydraulic Operations & Control</option>
                  <option value="Field & Maintenance">Field & Maintenance Team</option>
                  <option value="Water Quality & Safety">Water Quality & Safety</option>
                  <option value="Executive Administration">Network Administration</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
                >
                  Submit Access Request
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
