import { Activity } from 'lucide-react'

const LiveOperations = ({ onAction }) => {
    return (
        <div className="bg-white rounded-lg border border-municipal-gray-200 p-6">
            <h2 className="text-lg font-bold text-municipal-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-municipal-blue-600" />
                Live Operations
            </h2>

            <div className="space-y-4">
                {/* System Status */}
                <div className="flex items-center justify-between p-3 bg-municipal-gray-50 rounded-lg border border-municipal-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="font-semibold text-municipal-gray-700">System Status</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-green-700">ONLINE</span>
                </div>


            </div>
        </div>
    )
}

export default LiveOperations
