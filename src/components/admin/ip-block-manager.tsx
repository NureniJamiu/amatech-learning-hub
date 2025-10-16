'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IPBlock {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expiresAt: string | null;
  isActive: boolean;
  failedCount: number;
}

export function IPBlockManager() {
  const [blocks, setBlocks] = useState<IPBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [ipAddress, setIpAddress] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('15m');

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/ip-blocks');
      const data = await response.json();

      if (data.success) {
        setBlocks(data.blocks);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch IP blocks',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch IP blocks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert duration to milliseconds
    const durationMap: Record<string, number> = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      permanent: 0,
    };

    const durationMs = duration === 'permanent' ? undefined : durationMap[duration];

    try {
      const response = await fetch('/api/v1/admin/ip-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAddress,
          reason,
          durationMs,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: `IP ${ipAddress} has been blocked`,
        });
        setIsDialogOpen(false);
        setIpAddress('');
        setReason('');
        setDuration('15m');
        fetchBlocks();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to block IP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error blocking IP:', error);
      toast({
        title: 'Error',
        description: 'Failed to block IP',
        variant: 'destructive',
      });
    }
  };

  const handleUnblockIP = async (ipAddress: string) => {
    if (!confirm(`Are you sure you want to unblock ${ipAddress}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/admin/ip-blocks?ipAddress=${encodeURIComponent(ipAddress)}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: `IP ${ipAddress} has been unblocked`,
        });
        fetchBlocks();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to unblock IP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      toast({
        title: 'Error',
        description: 'Failed to unblock IP',
        variant: 'destructive',
      });
    }
  };

  const handleCleanup = async () => {
    try {
      const response = await fetch('/api/v1/admin/ip-blocks/cleanup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: `Cleaned up ${data.results.ipBlocksUnblocked} expired blocks and ${data.results.rateLimitsDeleted} rate limits`,
        });
        fetchBlocks();
      } else {
        toast({
          title: 'Error',
          description: 'Cleanup failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast({
        title: 'Error',
        description: 'Cleanup failed',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Permanent';
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              IP Block Management
            </CardTitle>
            <CardDescription>
              Manage blocked IP addresses and view suspicious activity
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCleanup}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Cleanup Expired
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Block IP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleBlockIP}>
                  <DialogHeader>
                    <DialogTitle>Block IP Address</DialogTitle>
                    <DialogDescription>
                      Block an IP address from accessing the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ipAddress">IP Address</Label>
                      <Input
                        id="ipAddress"
                        placeholder="192.168.1.1"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        placeholder="Suspicious activity"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Block IP</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No blocked IPs
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Failed Attempts</TableHead>
                <TableHead>Blocked At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell className="font-mono">{block.ipAddress}</TableCell>
                  <TableCell>{block.reason}</TableCell>
                  <TableCell>{block.failedCount}</TableCell>
                  <TableCell>{formatDate(block.blockedAt)}</TableCell>
                  <TableCell>{formatDate(block.expiresAt)}</TableCell>
                  <TableCell>
                    {isExpired(block.expiresAt) ? (
                      <span className="text-muted-foreground">Expired</span>
                    ) : (
                      <span className="text-red-600 font-medium">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnblockIP(block.ipAddress)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
