"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";

import { courses } from "@/data/mock-data";
import type { ChatMessage } from "@/types";
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI learning assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";

      if (
        message.toLowerCase().includes("hello") ||
        message.toLowerCase().includes("hi")
      ) {
        responseContent =
          "Hello! How can I assist you with your studies today?";
      } else if (message.toLowerCase().includes("exam")) {
        responseContent =
          "Exams can be stressful. Make sure to create a study schedule, take breaks, and focus on understanding concepts rather than memorizing.";
      } else if (
        selectedCourse !== "all" &&
        message.toLowerCase().includes("material")
      ) {
        const course = courses.find((c) => c.code === selectedCourse);
        responseContent = `For ${course?.code}, there are ${course?.materials.length} materials available. You can access them from the Courses section.`;
      } else {
        responseContent =
          "I'm here to help with your academic questions. Feel free to ask about course concepts, study strategies, or assignment help!";
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: showHelp ? "2fr 1fr" : "1fr" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>AI Learning Assistant</CardTitle>
          <CardDescription>
            Ask questions about your courses and get instant help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course to focus on" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.code}>
                    {course.code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded p-3 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p>{msg.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Type your question here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button size="icon" onClick={handleSendMessage}>
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
              <CardTitle>AI Assistant Help</CardTitle>
              <CardDescription>Tips for using the AI assistant</CardDescription>
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
              <h3 className="font-semibold">Course Selection</h3>
              <p className="text-sm text-muted-foreground">
                Select a specific course to get more targeted help with course
                materials and concepts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Example Questions</h3>
              <ul className="ml-4 list-disc text-sm text-muted-foreground">
                <li>Can you explain the concept of thermodynamics?</li>
                <li>What are the key formulas for Engineering Economics?</li>
                <li>How do I prepare for the upcoming Fluid Mechanics exam?</li>
                <li>
                  Can you help me understand this Materials Science problem?
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Limitations</h3>
              <p className="text-sm text-muted-foreground">
                The AI assistant provides general guidance and explanations. For
                official course information, always refer to your course
                materials and instructors.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
