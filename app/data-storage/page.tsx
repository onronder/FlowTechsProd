import { DataStorageContent } from '@/components/data-storage/data-storage-content'
import { InfoTooltip } from '@/components/ui/info-tooltip'

export default function DataStoragePage() {
  return (
    <div className="space-y-6">
      <InfoTooltip
        message="⚠️ The Data Storage page allows you to view and download your stored data files."
        pageIdentifier="data-storage"
      />
      <DataStorageContent />
    </div>
  )
}

