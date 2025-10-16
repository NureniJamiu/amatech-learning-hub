"use client";

import type React from "react";
import { useState } from "react";

import { GraduationCap, LogOut, User } from "lucide-react";
import { toast } from "react-toastify";

import { useAppContext } from "@/context/app-context";
import { logout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { CourseSidebar } from "@/components/course-sidebar";
import { MainNav } from "@/components/main-nav";
import { UserProfile } from "@/components/user-profile";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();
    const { isAdminMode, currentUser } = useAppContext();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        try {
            logout();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    const handleProfileClick = () => {
        setIsProfileOpen(true);
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b pb-3 pt-3">
                <div className="flex items-center gap-3 px-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shrink-0 shadow-lg">
                        <img
                            src="/images/logo.png"
                            alt="Amatech Logo"
                            className="h-6 w-6 object-contain brightness-0 invert"
                        />
                    </div>
                    <div
                        className={`flex flex-col transition-all duration-200 ease-in-out ${
                            state === "collapsed"
                                ? "w-0 opacity-0 overflow-hidden"
                                : "w-auto opacity-100"
                        }`}
                    >
                        <span className="font-bold text-lg whitespace-nowrap tracking-tight">
                            AmaLearn
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                            Student Learning Hub
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <MainNav />
                {isAdminMode ? <AdminSidebar /> : <CourseSidebar />}
            </SidebarContent>
            <SidebarFooter className="border-t pt-3 pb-3">
                {state === "collapsed" ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleProfileClick}
                                tooltip="View Profile"
                                className="w-full justify-center hover:bg-green-500/10"
                            >
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {currentUser?.name
                                        ? currentUser.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleLogout}
                                tooltip="Logout"
                                className="w-full justify-center hover:bg-red-500/10"
                            >
                                <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <>
                        <div
                            className="flex items-center gap-3 p-3 mx-2 cursor-pointer hover:bg-green-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-green-500/20"
                            onClick={handleProfileClick}
                        >
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                                {currentUser?.name
                                    ? currentUser.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-semibold whitespace-nowrap truncate">
                                    {currentUser?.name || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap truncate">
                                    {currentUser?.email || "user@example.com"}
                                </span>
                            </div>
                        </div>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={handleLogout}
                                    className="w-full mx-2 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />
                                    <span className="font-medium">Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </>
                )}
            </SidebarFooter>
            <SidebarRail />

            {/* User Profile Dialog */}
            <UserProfile
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </Sidebar>
    );
}
