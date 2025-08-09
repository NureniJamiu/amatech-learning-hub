"use client";

import React, { useState, useEffect } from "react";
import { Send, X, BookOpen, Clock, Sparkles } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { useChat } from "@/hooks/use-ai-chat";
import type { ChatMessage } from "@/hooks/use-ai-chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function AIAssistantView() {
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [message, setMessage] = useState("");
    const [showHelp, setShowHelp] = useState(true);

    const { data: user } = useCurrentUser();
    const { data: coursesResponse } = useCourses({
        search: undefined,
        limit: 100,
    });

    const courses = coursesResponse?.courses || [];

    // Filter courses by user's level and semester if available
    const userCourses = user
        ? courses.filter(
              (course) =>
                  course.level === user.level &&
                  (!user.currentSemester ||
                      course.semester === user.currentSemester)
          )
        : courses;

    const {
        messages,
        sessions,
        currentSessionId,
        isTyping,
        isLoading,
        sendMessage,
        startNewSession,
        loadSession,
    } = useChat(
        user?.id,
        selectedCourse === "all" ? undefined : selectedCourse
    );

    const handleSendMessage = async () => {
        if (!message.trim() || !user) return;

        await sendMessage(message);
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Initialize with welcome message
    useEffect(() => {
        if (messages.length === 0 && user && !currentSessionId) {
            // Show welcome message based on course selection
            const welcomeMessages: ChatMessage[] = [
                {
                    id: "welcome-1",
                    content:
                        selectedCourse === "all"
                            ? `Hello ${user.name}! I'm your AI learning assistant. I can help you with questions about your course materials. Select a specific course to get more targeted help, or ask me general questions about your studies.`
                            : `Hello ${user.name}! I'm ready to help you with ${
                                  courses.find((c) => c.id === selectedCourse)
                                      ?.code || "your selected course"
                              }. Ask me anything about the course materials!`,
                    role: "assistant" as const,
                    createdAt: new Date().toISOString(),
                },
            ];
        }
    }, [selectedCourse, user, messages.length, currentSessionId, courses]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 sm:p-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="w-full sm:w-auto">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                AI Learning Assistant
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Ask questions about your course materials and
                                get instant help
                            </CardDescription>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {currentSessionId && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startNewSession}
                                    className="flex-1 sm:flex-none"
                                >
                                    New Chat
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Select
                            value={selectedCourse}
                            onValueChange={setSelectedCourse}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a course to focus on" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {userCourses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.code} - {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedCourse !== "all" && (
                            <p className="text-xs text-muted-foreground">
                                Questions will be answered using materials from
                                this course
                            </p>
                        )}
                    </div>
                    <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
                        <div className="space-y-3 sm:space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`flex max-w-[90%] sm:max-w-[80%] items-start gap-2 rounded p-2 sm:p-3 ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {msg.role === "assistant" && (
                                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                                <AvatarFallback className="text-xs">
                                                    AI
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="whitespace-pre-wrap text-sm sm:text-base">
                                                {msg.content}
                                            </p>

                                            {/* Show sources if available */}
                                            {msg.sources &&
                                                msg.sources.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs font-semibold">
                                                            Sources:
                                                        </p>
                                                        {msg.sources.map(
                                                            (source, index) => (
                                                                <div
                                                                    key={
                                                                        source.chunkId
                                                                    }
                                                                    className="text-xs bg-background/50 rounded p-2"
                                                                >
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <BookOpen className="h-3 w-3 flex-shrink-0" />
                                                                        <span className="font-medium truncate">
                                                                            {
                                                                                source.materialTitle
                                                                            }
                                                                        </span>
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            {Math.round(
                                                                                source.similarity *
                                                                                    100
                                                                            )}
                                                                            %
                                                                            match
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="mt-1 text-muted-foreground">
                                                                        {
                                                                            source.content
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            {/* Show follow-up suggestions */}
                                            {msg.metadata
                                                ?.followUpSuggestions && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-semibold mb-1">
                                                        You might also ask:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {msg.metadata.followUpSuggestions.map(
                                                            (
                                                                suggestion: string,
                                                                index: number
                                                            ) => (
                                                                <Button
                                                                    key={index}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-xs h-6"
                                                                    onClick={() =>
                                                                        setMessage(
                                                                            suggestion
                                                                        )
                                                                    }
                                                                >
                                                                    {suggestion}
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <p className="mt-1 text-xs opacity-70">
                                                {new Date(
                                                    msg.createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-start gap-2 rounded p-2 sm:p-3 bg-muted text-muted-foreground">
                                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                            <AvatarFallback className="text-xs">
                                                AI
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center gap-1">
                                            <div className="flex space-x-1">
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                                                <div
                                                    className="h-2 w-2 bg-current rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "0.1s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="h-2 w-2 bg-current rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "0.2s",
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs ml-2">
                                                AI is thinking...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-3 sm:p-6">
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            placeholder="Ask me about your course materials..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                            className="text-sm sm:text-base"
                        />
                        <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={isLoading || !message.trim()}
                            className="flex-shrink-0"
                        >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {showHelp && (
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-lg">
                                AI Assistant Features
                            </CardTitle>
                            <CardDescription className="text-sm">
                                How to get the best help
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowHelp(false)}
                            className="lg:hidden"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                                <BookOpen className="h-4 w-4" />
                                Course Materials
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                I can answer questions based on your uploaded
                                course materials. Select a specific course for
                                more accurate, material-based responses.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Smart Features
                            </h3>
                            <ul className="ml-4 list-disc text-xs sm:text-sm text-muted-foreground space-y-1">
                                <li>
                                    Source citations for all material-based
                                    answers
                                </li>
                                <li>Follow-up question suggestions</li>
                                <li>
                                    Out-of-scope detection with fallback options
                                </li>
                                <li>Confidence scoring for responses</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Example Questions
                            </h3>
                            <ul className="ml-4 list-disc text-xs sm:text-sm text-muted-foreground space-y-1">
                                <li>
                                    Explain the concept of [topic] from my
                                    materials
                                </li>
                                <li>
                                    What are the key points about [subject]?
                                </li>
                                <li>Help me understand [difficult concept]</li>
                                <li>Summarize the material on [topic]</li>
                            </ul>
                        </div>
                        {sessions.length > 0 && (
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <Clock className="h-4 w-4" />
                                    Recent Sessions
                                </h3>
                                <div className="space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                                    {sessions.slice(0, 5).map((session) => (
                                        <Button
                                            key={session.id}
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start text-left h-auto p-2"
                                            onClick={() =>
                                                loadSession(session.id)
                                            }
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate text-xs sm:text-sm">
                                                    {session.title ||
                                                        "Untitled Chat"}
                                                </p>
                                                {session.course && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {session.course.code}
                                                    </p>
                                                )}
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Limitations
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Responses are based on uploaded materials. For
                                official course information, always refer to
                                your instructors and course guidelines.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
