"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    X,
    CheckCircle2,
    AlertTriangle,
    Shield,
    TrendingUp,
    Clock,
    Trash2,
    Check
} from "lucide-react";
import { useNotificationStore, Notification, NotificationPriority } from "@/lib/store/notification-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const priorityConfig: Record<NotificationPriority, { color: string; bg: string; icon: any }> = {
    critical: { color: "text-[var(--danger)]", bg: "bg-[var(--danger)]/10", icon: AlertTriangle },
    high: { color: "text-[var(--warning)]", bg: "bg-[var(--warning)]/10", icon: Shield },
    medium: { color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10", icon: Bell },
    low: { color: "text-[var(--text-secondary)]", bg: "bg-[var(--icon-bg)]", icon: CheckCircle2 },
};

export function NotificationCenter() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            // Handle action navigation
        }
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
                <Bell size={18} strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 w-[380px] max-h-[600px] bg-[var(--background)] border border-[var(--card-border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)]">
                                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {notifications.length > 0 && (
                                        <>
                                            <button
                                                onClick={markAllAsRead}
                                                className="p-2 rounded-lg hover:bg-[var(--icon-bg)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider"
                                                title="Mark all as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={clearAll}
                                                className="p-2 rounded-lg hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]"
                                                title="Clear all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Notification List */}
                            <div className="max-h-[500px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Bell size={32} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
                                        <p className="text-sm font-medium text-[var(--text-secondary)]">No notifications yet</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">We'll notify you when something important happens</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[var(--card-border)]">
                                        {notifications.map((notification) => {
                                            const config = priorityConfig[notification.priority];
                                            const IconComponent = config.icon;

                                            return (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className={cn(
                                                        "p-4 hover:bg-[var(--icon-bg)] cursor-pointer transition-colors relative",
                                                        !notification.read && "bg-[var(--primary)]/[0.02]"
                                                    )}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    {!notification.read && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r" />
                                                    )}
                                                    <div className="flex items-start space-x-3">
                                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
                                                            <IconComponent size={18} className={config.color} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <p className={cn("text-xs font-bold", notification.read ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]")}>
                                                                    {notification.title}
                                                                </p>
                                                                <span className="text-[10px] text-[var(--text-muted)] ml-2 shrink-0">
                                                                    {formatTime(notification.timestamp)}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                                                {notification.message}
                                                            </p>
                                                            {notification.actionLabel && (
                                                                <button className="mt-2 text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider hover:underline">
                                                                    {notification.actionLabel}
                                                                </button>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notification.id);
                                                            }}
                                                            className="p-1 rounded hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
