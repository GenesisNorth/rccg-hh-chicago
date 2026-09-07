"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Paperclip,
  Image,
  FileText,
  Mic,
  MicOff,
  Smile,
  Plus,
  Camera,
} from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, type?: "text" | "image" | "file" | "audio", fileData?: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({ 
  onSendMessage, 
  placeholder = "Type a message...",
  disabled = false 
}: MessageInputProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create file data
    const fileData = {
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file), // In real app, upload to server first
    };

    const content = type === "image" ? "📷 Image" : `📎 ${file.name}`;
    onSendMessage(content, type, fileData);

    // Reset input
    e.target.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const fileData = {
          fileName: `voice-message-${Date.now()}.wav`,
          fileSize: audioBlob.size,
          fileUrl: audioUrl,
        };

        onSendMessage("🎵 Voice message", "audio", fileData);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const commonEmojis = ["😊", "😂", "❤️", "👍", "🙏", "😢", "😮", "😡", "🎉", "🔥"];

  return (
    <div className="flex items-end gap-2">
      {/* Attachment Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top">
          <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
            <Image className="mr-2 h-4 w-4" />
            Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Document
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
        onChange={(e) => handleFileUpload(e, "file")}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, "image")}
        className="hidden"
      />

      {/* Emoji Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Smile className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top">
          <div className="grid grid-cols-5 gap-1 p-2">
            {commonEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Message Input */}
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-12"
          maxLength={2000}
        />
        
        {/* Character count for long messages */}
        {message.length > 1800 && (
          <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
            {2000 - message.length} characters left
          </div>
        )}
      </div>

      {/* Voice Message Button */}
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        className={isRecording ? "bg-red-100 text-red-600" : ""}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {/* Send Button */}
      <Button 
        onClick={handleSend} 
        disabled={!message.trim() || disabled}
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}