"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, X, BookOpen, Clock, Sparkles, FileText, AlertCircle, Bot, User as UserIcon } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useMaterials } from "@/hooks/use-materials";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AIAssistantView() {
    const [selectedMaterial, setSelectedMaterial] = useState<string>("");
    const [message, setMessage] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const [showNoSelectionWarning, setShowNoSelectionWarning] = useState(false);

    // Ref for auto-scrolling to bottom of messages
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: user } = useCurrentUser();
    const { data: materialsResponse } = useMaterials({
        limit: 100,
    });

    const materials = materialsResponse?.materials || [];

    // Filter only processed materials
    const processedMaterials = materials.filter(
        (material) => material.processed && material.processingStatus === "completed"
    );

    // Get the selected material data
    const selectedMaterialData = processedMaterials.find(m => m.id === selectedMaterial);

    // Extract courseId and materialId from selected material for the chat hook
    const courseIdForChat = selectedMaterialData?.courseId;
    const materialIdForChat = selectedMaterial;

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
        courseIdForChat,
        materialIdForChat
    );

    const handleSendMessage = async () => {
        if (!message.trim() || !user) return;

        // Check if material is selected
        if (!selectedMaterial) {
            setShowNoSelectionWarning(true);
            return;
        }

        setShowNoSelectionWarning(false);

        // Debug logging
        console.log('[AI Assistant] Sending message with:', {
            materialId: selectedMaterial,
            materialTitle: selectedMaterialData?.title,
            courseId: courseIdForChat,
            courseName: selectedMaterialData?.course.title,
            chunksCount: selectedMaterialData?.chunksCount,
        });

        await sendMessage(message);
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)] w-full overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Card className="flex-1 flex flex-col h-full overflow-hidden">
                    <CardHeader className="border-b flex-shrink-0">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md flex-shrink-0">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-lg truncate">AI Learning Assistant</CardTitle>
                                    <CardDescription className="text-xs truncate">
                                        {selectedMaterialData
                                            ? `Chatting about: ${selectedMaterialData.title}`
                                            : "Select a material to start learning"
                                        }
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {currentSessionId && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={startNewSession}
                                    >
                                        New Chat
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    className="lg:hidden"
                                >
                                    {showSidebar ? <X className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        {/* Material Selection */}
                        <div className="p-4 border-b bg-muted/30 flex-shrink-0">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Select Processed Material
                                </label>
                                <Select
                                    value={selectedMaterial}
                                    onValueChange={(value) => {
                                        setSelectedMaterial(value);
                                        setShowNoSelectionWarning(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a material to query..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {processedMaterials.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                No processed materials available yet
                                            </div>
                                        ) : (
                                            processedMaterials.map((material) => (
                                                <SelectItem
                                                    key={material.id}
                                                    value={material.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-3 w-3" />
                                                        <span className="truncate">{material.title}</span>
                                                        <Badge variant="secondary" className="text-xs ml-auto">
                                                            {material.course.code}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {selectedMaterial && selectedMaterialData && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-xs">
                                            {selectedMaterialData.chunksCount} chunks
                                        </Badge>
                                        <span>•</span>
                                        <span className="truncate">{selectedMaterialData.course.title}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Warning Alert */}
                        {showNoSelectionWarning && (
                            <div className="p-4 flex-shrink-0">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Please select a material first before asking questions. This helps me provide accurate answers based on your course content.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 overflow-y-auto">
                            <div className="p-4">
                            {messages.length === 0 && !selectedMaterial ? (
                                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full mb-4">
                                        <Sparkles className="h-12 w-12 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Welcome to AI Learning Assistant</h3>
                                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                                        Select a processed material from the dropdown above to start asking questions and get instant help with your studies.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-6">
                                        <div className="p-3 border rounded-lg text-left hover:border-green-500/30 transition-colors">
                                            <FileText className="h-5 w-5 text-green-600 mb-2" />
                                            <p className="text-xs font-medium">Material-Based Answers</p>
                                            <p className="text-xs text-muted-foreground">Get responses based on your uploaded course materials</p>
                                        </div>
                                        <div className="p-3 border rounded-lg text-left hover:border-green-500/30 transition-colors">
                                            <BookOpen className="h-5 w-5 text-green-600 mb-2" />
                                            <p className="text-xs font-medium">Source Citations</p>
                                            <p className="text-xs text-muted-foreground">See exactly where answers come from</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            {msg.role === "assistant" && (
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                                                    AI
                                                </div>
                                            )}
                                            <div
                                                className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-4 py-3 ${msg.role === "user"
                                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                                                        : "bg-muted border"
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                        {msg.content}
                                                    </p>

                                                    {/* Show sources if available */}
                                                    {msg.sources && msg.sources.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            <p className="text-xs font-semibold opacity-80">
                                                                📚 Sources:
                                                            </p>
                                                            {msg.sources.map((source) => (
                                                                <div
                                                                    key={source.chunkId}
                                                                    className="text-xs bg-background/80 rounded-lg p-2 border"
                                                                >
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <BookOpen className="h-3 w-3" />
                                                                        <span className="font-medium truncate flex-1">
                                                                            {source.materialTitle}
                                                                        </span>
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {Math.round(source.similarity * 100)}%
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-muted-foreground line-clamp-2">
                                                                        {source.content}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Show follow-up suggestions */}
                                                    {msg.metadata?.followUpSuggestions && (
                                                        <div className="mt-3">
                                                            <p className="text-xs font-semibold mb-2 opacity-80">
                                                                💡 You might also ask:
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {msg.metadata.followUpSuggestions.map(
                                                                    (suggestion: string, index: number) => (
                                                                        <Button
                                                                            key={index}
                                                                            variant="secondary"
                                                                            size="sm"
                                                                            className="text-xs h-7 bg-background/80 hover:bg-background"
                                                                            onClick={() => setMessage(suggestion)}
                                                                        >
                                                                            {suggestion}
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1 px-2">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="h-8 w-8 rounded-lg bg-white border-2 border-green-500/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <UserIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex gap-3 justify-start">
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                                                AI
                                            </div>
                                            <div className="rounded-2xl px-4 py-3 bg-muted border">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex space-x-1">
                                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="h-2 w-2 bg-green-500 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.1s" }}
                                                        ></div>
                                                        <div
                                                            className="h-2 w-2 bg-green-500 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        AI is thinking...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Invisible div for auto-scroll */}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    {/* Input Area */}
                    <CardFooter className="border-t p-4 flex-shrink-0">
                        <div className="flex w-full items-end gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder={
                                        selectedMaterial
                                            ? "Ask me anything about this material..."
                                            : "Select a material first to start chatting..."
                                    }
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isLoading || !selectedMaterial}
                                    className="resize-none"
                                />
                            </div>
                            <Button
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={isLoading || !message.trim() || !selectedMaterial}
                                className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Sidebar */}
            {showSidebar && (
                <Card className={`w-full lg:w-80 flex-shrink-0 h-full overflow-hidden flex flex-col ${showSidebar ? 'block' : 'hidden lg:block'}`}>
                    <CardHeader className="border-b flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Chat History & Tips</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSidebar(false)}
                                className="lg:hidden h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <CardContent className="p-4 space-y-6">
                        {/* Recent Sessions */}
                        {sessions.length > 0 && (
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 text-sm mb-3">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    Recent Sessions
                                </h3>
                                <ScrollArea className="h-48">
                                    <div className="space-y-2">
                                        {sessions.slice(0, 10).map((session) => (
                                            <Button
                                                key={session.id}
                                                variant={currentSessionId === session.id ? "secondary" : "ghost"}
                                                size="sm"
                                                className="w-full justify-start text-left h-auto p-3 hover:bg-muted"
                                                onClick={() => loadSession(session.id)}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium truncate text-xs">
                                                        {session.title || "Untitled Chat"}
                                                    </p>
                                                    {session.course && (
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {session.course.code}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(session.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        {/* Quick Tips */}
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 text-sm mb-3">
                                <Sparkles className="h-4 w-4 text-green-600" />
                                Quick Tips
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors">
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                        📖 Material-Based
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Answers come directly from your selected course material
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors">
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                        🎯 Be Specific
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Ask detailed questions for better, more accurate responses
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg hover:border-emerald-500/40 transition-colors">
                                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                                        ✨ Follow-ups
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Click suggested questions to dive deeper into topics
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Example Questions */}
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Example Questions</h3>
                            <div className="space-y-2">
                                {[
                                    "Explain the main concepts in this material",
                                    "What are the key takeaways?",
                                    "Summarize the important points",
                                    "Help me understand [specific topic]"
                                ].map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMessage(example)}
                                        className="w-full text-left p-2 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                        disabled={!selectedMaterial}
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="pt-4 border-t">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-blue-500">
                                        {processedMaterials.length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Materials Ready</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-green-500">
                                        {sessions.length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Chat Sessions</p>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                💡 <strong>Note:</strong> Responses are based on uploaded materials. Always verify important information with your instructors.
                            </p>
                        </div>
                    </CardContent>
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
}
