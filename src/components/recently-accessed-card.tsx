"use client";

import { FileText, Calendar, ExternalLink, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentlyAccessed } from "@/hooks/use-recently-accessed";
import { formatDistanceToNow } from "date-fns";

export function RecentlyAccessedCard() {
  const { recentItems, clearAll } = useRecentlyAccessed();

  const handleOpenFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (recentItems.length === 0) {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recently Accessed</CardTitle>
          <CardDescription>
            Your recently viewed materials and past questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring course materials and past questions to see them here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Recently Accessed</CardTitle>
          <CardDescription>
            Your recently viewed materials and past questions
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                {item.type === 'material' ? (
                  <FileText className="h-5 w-5 text-blue-600" />
                ) : (
                  <Calendar className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.type === 'pastQuestion' && item.year && (
                    <Badge variant="outline" className="text-xs">
                      {item.year}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.courseCode}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(item.accessedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            {item.fileUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenFile(item.fileUrl!)}
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
