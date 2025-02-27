import { Metadata } from 'next'
import { AIInsightsContent } from '@/components/ai-insights/ai-insights-content'
import { InfoTooltip } from '@/components/ui/info-tooltip'

export const metadata: Metadata = {
  title: 'AI Insights',
  description: 'Analyze your Shopify data using AI',
}

export default function AIInsightsPage() {
  return (
    <div className="space-y-6 bg-white dark:bg-[#1E1E2D] min-h-screen p-8 font-poppins">
      <InfoTooltip
        message="The AI Insights page helps you upload and analyze your Shopify data to find trends, correlations, and actionable insights using AI."
        pageIdentifier="ai-insights"
      />
      <AIInsightsContent />
    </div>
  )
}

