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
        <div
            className="grid gap-4"
            style={{ gridTemplateColumns: showHelp ? "2fr 1fr" : "1fr" }}
        >
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-500" />
                                AI Learning Assistant
                            </CardTitle>
                            <CardDescription>
                                Ask questions about your course materials and
                                get instant help
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {currentSessionId && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startNewSession}
                                >
                                    New Chat
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Select
                            value={selectedCourse}
                            onValueChange={setSelectedCourse}
                        >
                            <SelectTrigger>
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
                            <p className="text-xs text-muted-foreground mt-1">
                                Questions will be answered using materials from
                                this course
                            </p>
                        )}
                    </div>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
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
                                        className={`flex max-w-[80%] items-start gap-2 rounded p-3 ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {msg.role === "assistant" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    AI
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex-1">
                                            <p className="whitespace-pre-wrap">
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
                                                                    <div className="flex items-center gap-2">
                                                                        <BookOpen className="h-3 w-3" />
                                                                        <span className="font-medium">
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
                                    <div className="flex items-start gap-2 rounded p-3 bg-muted text-muted-foreground">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>AI</AvatarFallback>
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
                <CardFooter>
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            placeholder="Ask me about your course materials..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={isLoading || !message.trim()}
                        >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {showHelp && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>AI Assistant Features</CardTitle>
                            <CardDescription>
                                How to get the best help
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowHelp(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Course Materials
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                I can answer questions based on your uploaded
                                course materials. Select a specific course for
                                more accurate, material-based responses.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Smart Features</h3>
                            <ul className="ml-4 list-disc text-sm text-muted-foreground space-y-1">
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
                            <h3 className="font-semibold">Example Questions</h3>
                            <ul className="ml-4 list-disc text-sm text-muted-foreground space-y-1">
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
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Recent Sessions
                                </h3>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
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
                                            <div>
                                                <p className="font-medium truncate">
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
                            <h3 className="font-semibold">Limitations</h3>
                            <p className="text-sm text-muted-foreground">
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
