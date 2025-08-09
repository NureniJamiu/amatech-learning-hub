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
                  <CardTitle className="text-lg sm:text-xl">
                      Recently Accessed
                  </CardTitle>
                  <CardDescription className="text-sm">
                      Your recently viewed materials and past questions
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="text-center py-6 sm:py-8">
                      <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                          No Recent Activity
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                          Start exploring course materials and past questions to
                          see them here.
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
                  <CardTitle className="text-lg sm:text-xl">
                      Recently Accessed
                  </CardTitle>
                  <CardDescription className="text-sm">
                      Your recently viewed materials and past questions
                  </CardDescription>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
              >
                  <Trash2 className="h-4 w-4" />
              </Button>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
              {recentItems.map((item) => (
                  <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                              {item.type === "material" ? (
                                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              ) : (
                                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium truncate">
                                      {item.title}
                                  </p>
                                  {item.type === "pastQuestion" &&
                                      item.year && (
                                          <Badge
                                              variant="outline"
                                              className="text-xs flex-shrink-0"
                                          >
                                              {item.year}
                                          </Badge>
                                      )}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                                  <span className="truncate">
                                      {item.courseCode}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-xs truncate">
                                      {formatDistanceToNow(
                                          new Date(item.accessedAt),
                                          { addSuffix: true }
                                      )}
                                  </span>
                              </div>
                          </div>
                      </div>
                      {item.fileUrl && (
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenFile(item.fileUrl!)}
                              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0"
                          >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                      )}
                  </div>
              ))}
          </CardContent>
      </Card>
  );
}
