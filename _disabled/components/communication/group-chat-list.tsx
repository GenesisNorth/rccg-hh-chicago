"use client";

import { ChatList } from "./chat-list";

// Group chat list re-exports or extends ChatList to show only group/channel type chats
// This component is a filtered view showing only group and channel conversations.

interface Chat {
  id: string;
  type: "direct" | "group" | "channel";
  name: string;
  description?: string;
  avatar?: string;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    type: "text" | "image" | "file" | "audio";
  };
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  unreadCount: number;
  isTyping?: Array<{
    userId: string;
    userName: string;
  }>;
  isPinned: boolean;
  isMuted: boolean;
  ministry?: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

export function GroupChatList({ chats, selectedChat, onChatSelect }: GroupChatListProps) {
  const groupChats = chats.filter((c) => c.type === "group" || c.type === "channel");
  return (
    <ChatList chats={groupChats} selectedChat={selectedChat} onChatSelect={onChatSelect} />
  );
}
