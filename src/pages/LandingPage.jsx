import { Link } from 'react-router-dom'
import {
  Droplets,
  ShieldCheck,
  ArrowRight,
  Server,
  Database,
  Activity,
  Cpu,
  Users,
  FileText,
  Lock,
  Radio,
  Sliders,
  MapPin,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Mountain,
  TrendingDown,
  Zap,
  Gauge
} from 'lucide-react'
import { useEffect, useState } from 'react'

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToWorkflow = () => {
    const element = document.getElementById('operational-workflow')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-700 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-[calc(100%-2rem)] left-4 right-4 top-4 rounded-xl transition-all duration-500 z-50 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border border-slate-200' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-sky-600 text-white p-2 rounded-lg">
                <Mountain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none">HILLWATER</span>
                <span className="text-[10px] font-bold text-sky-700 tracking-[0.2em] uppercase">Hill Town Water Intelligence</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold">
                Nainital Demonstration Network
              </span>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white transition-all duration-300 bg-slate-900 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none"
              >
                Operations Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#F8FAFC]">
        {/* Engineering Background Grid */}
        <div className="absolute inset-0 z-0">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M60 0L0 60" stroke="#0F172A" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
                <path d="M0 0L60 60" stroke="#0F172A" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <circle cx="20%" cy="30%" r="350" fill="#0284C7" fillOpacity="0.04" />
            <circle cx="80%" cy="70%" r="400" fill="#0F172A" fillOpacity="0.02" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F8FAFC] via-transparent to-[#E0F2FE]/50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 text-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold uppercase tracking-widest shadow-sm">
            <Mountain className="w-3.5 h-3.5 text-sky-600" />
            Predictive Water-Service Reliability for Hill Towns
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Smart Water. <br />
            <span className="text-sky-600">Stronger Hill Towns.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-4 font-medium tracking-wide max-w-3xl mx-auto">
            "Monitoring is the input. Decision is the product."
          </p>

          <p className="text-sm md:text-base text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Elevating hydraulic stability across extreme altitude gradients (1,500m–2,260m). Predicting failures, explaining root causes, and simulating interventions before service disruptions occur.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/overview"
              className="inline-flex items-center justify-center h-13 px-8 text-sm font-bold text-white transition-all duration-300 bg-sky-600 rounded-lg hover:bg-sky-700 shadow-lg hover:shadow-sky-200 hover:-translate-y-0.5"
            >
              Launch Live Demonstration <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <button
              onClick={scrollToWorkflow}
              className="inline-flex items-center justify-center h-13 px-8 text-sm font-bold text-slate-700 transition-all duration-300 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              How It Works
            </button>
          </div>

          <div className="mt-8">
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              SIMULATED DEMO DATA — NOT LIVE SENSOR DATA
            </span>
          </div>
        </div>
      </section>

      {/* Product Flow Section: Real-Time Data -> Decision */}
      <section id="operational-workflow" className="py-24 bg-white relative scroll-mt-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">The Intelligence Pipeline</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">From Telemetry to Better Decisions</h3>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-base">
              Elevation + Pressure + Flow + Tank Level + Demand → Zone Risk → Likely Cause → Prediction → Simulated Outcome
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Radio,
                step: "01. TERRAIN TELEMETRY",
                title: "Elevation-Aware Data",
                desc: "Captures pressure, flow, and tank storage mapped against 1,500m–2,260m topography."
              },
              {
                icon: Cpu,
                step: "02. RISK PREDICTION",
                title: "Predictive Horizon",
                desc: "Analyzes pressure gradient decline to predict hydraulic failures 30–60 min in advance."
              },
              {
                icon: Activity,
                step: "03. ROOT-CAUSE EXPLANATION",
                title: "Transparent 'Why?'",
                desc: "Quantifies exact drivers: Tourist demand, elevation head loss, or storage deficits."
              },
              {
                icon: Sliders,
                step: "04. SCENARIO SIMULATION",
                title: "What-If Decision Tool",
                desc: "Operators test booster pump and valve adjustments to verify outcomes before execution."
              }
            ].map((card, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-700 tracking-wider block mb-1">
                  {card.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{card.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hill Towns Are Different */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">
                Hydraulic Engineering Context
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">
                Why Hill Towns Require Specialized Water Intelligence
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Water networks in mountain towns face physics challenges unknown to flat plains: <strong className="text-slate-900">steep gravity head losses</strong>, high pumping energy to overcome 700m+ elevation spans, and <strong className="text-slate-900">sudden tourist surges</strong> that rapidly deplete ridge-top feeder tanks.
                </p>
                <p>
                  In high-altitude zones like Ayarpatta (2,260m) and Mallital (2,050m), pressure drops occur 3x faster under load. Standard monitoring alerts operators only after dry taps occur.
                </p>
                <p>
                  <strong className="text-sky-700">HillWater</strong> transforms reactive firefighting into proactive engineering control.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Topographic Gradient Resistance",
                  desc: "Elevation constraint is factored into every zone's risk scoring model.",
                  icon: Mountain,
                  color: "text-sky-600",
                  bg: "bg-sky-50"
                },
                {
                  title: "Tourist Demand Spikes",
                  desc: "Hospitality corridors experience rapid 45%+ demand surges that cascade into tail-end pressure drops.",
                  icon: Users,
                  color: "text-rose-600",
                  bg: "bg-rose-50"
                },
                {
                  title: "Pre-emptive Booster Calibration",
                  desc: "Simulate and verify pump boosts and valve modulations before dispatching field technicians.",
                  icon: Zap,
                  color: "text-amber-600",
                  bg: "bg-amber-50"
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-mono gap-4">
          <div>
            <span className="text-white font-bold font-sans">HILLWATER</span> • Predictive Water-Service Reliability for Hill Towns
          </div>
          <div className="text-amber-500 text-[11px] font-bold">
            SIMULATED DEMO DATA — NOT LIVE SENSOR DATA
          </div>
          <div>Prototype Platform • v3.2.0</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
