'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialProcessingStatusProps {
  materialId: string;
  initialStatus?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface StatusData {
  material: {
    id: string;
    title: string;
    processingStatus: string;
    processingError?: string | null;
    chunksCount: number;
    processed: boolean;
    processingDuration?: string | null;
  };
  queueJob?: {
    id: string;
    status: string;
    attempts: number;
    maxAttempts: number;
    error?: string | null;
  } | null;
}

export function MaterialProcessingStatus({
  materialId,
  initialStatus = 'pending',
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 5000,
}: MaterialProcessingStatusProps) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/materials/${materialId}/status`);
      
      if (response.ok) {
        const data: StatusData = await response.json();
        setStatusData(data);
        setStatus(data.material.processingStatus);
      }
    } catch (error) {
      console.error('Error fetching material status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial status
    fetchStatus();

    // Set up auto-refresh if enabled and status is not final
    if (autoRefresh && !['completed', 'failed'].includes(status)) {
      const interval = setInterval(() => {
        fetchStatus();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [materialId, autoRefresh, status, refreshInterval]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-700',
        };
      case 'queued':
        return {
          label: 'Queued',
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-700',
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: Loader2,
          variant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-700',
          animate: true,
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          variant: 'default' as const,
          className: 'bg-green-100 text-green-700',
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: XCircle,
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-700',
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-700',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-2">
      <Badge
        variant={config.variant}
        className={cn('flex items-center gap-1.5 w-fit', config.className)}
      >
        <Icon
          className={cn('h-3.5 w-3.5', config.animate && 'animate-spin')}
        />
        {config.label}
      </Badge>

      {showDetails && statusData && (
        <div className="text-xs text-muted-foreground space-y-1">
          {statusData.material.processed && (
            <div>Chunks: {statusData.material.chunksCount}</div>
          )}
          
          {statusData.material.processingDuration && (
            <div>Duration: {statusData.material.processingDuration}</div>
          )}
          
          {statusData.queueJob && statusData.queueJob.attempts > 0 && (
            <div>
              Attempts: {statusData.queueJob.attempts}/{statusData.queueJob.maxAttempts}
            </div>
          )}
          
          {statusData.material.processingError && (
            <div className="text-red-600 mt-1">
              Error: {statusData.material.processingError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
