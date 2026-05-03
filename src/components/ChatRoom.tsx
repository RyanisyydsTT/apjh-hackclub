"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileUp,
  Hash,
  Loader2,
  Lock,
  MessageCircle,
  Plus,
  Send,
  Users,
} from "lucide-react";

type UserSummary = {
  id: string;
  username: string;
  realName: string | null;
  role: string;
};

type Channel = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPrivate: boolean;
  members: { user: UserSummary }[];
};

type DirectThread = {
  id: string;
  members: { user: UserSummary }[];
};

type Message = {
  id: string;
  text: string;
  createdAt: Date | string;
  user: {
    username: string;
    realName: string | null;
  };
  attachments: {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    expiresAt: Date | string;
  }[];
};

type CurrentUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

type Conversation =
  | { type: "channel"; id: string }
  | { type: "dm"; id: string; peerId: string };

type ChatRoomProps = {
  channels: Channel[];
  users: UserSummary[];
  directThreads: DirectThread[];
  initialMessages: Message[];
  currentUser: CurrentUser;
};

function displayUser(user: UserSummary) {
  return user.realName || user.username;
}

export const ChatRoom = ({
  channels: initialChannels,
  users,
  directThreads: initialDirectThreads,
  initialMessages,
  currentUser,
}: ChatRoomProps) => {
  const [channels, setChannels] = useState(initialChannels);
  const [directThreads, setDirectThreads] = useState(initialDirectThreads);
  const [selected, setSelected] = useState<Conversation>({
    type: "channel",
    id: initialChannels[0]?.id ?? "general",
  });
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelMembers, setNewChannelMembers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLeader = currentUser.role === "LEADER";

  const selectedChannel = selected.type === "channel"
    ? channels.find((channel) => channel.id === selected.id)
    : null;

  const selectedPeer = selected.type === "dm"
    ? users.find((user) => user.id === selected.peerId)
    : null;

  const dmByUserId = useMemo(() => {
    const map = new Map<string, DirectThread>();
    directThreads.forEach((thread) => {
      const peer = thread.members.find((member) => member.user.id !== currentUser.id)?.user;
      if (peer) map.set(peer.id, thread);
    });
    return map;
  }, [currentUser.id, directThreads]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages(showLoading = false) {
      if (showLoading) setLoadingMessages(true);
      try {
        const params = new URLSearchParams({ type: selected.type, id: selected.id });
        const res = await fetch(`/api/chat?${params.toString()}`);
        if (res.ok && !cancelled) {
          setMessages(await res.json());
        }
      } finally {
        if (showLoading && !cancelled) setLoadingMessages(false);
      }
    }

    loadMessages(true);
    const interval = window.setInterval(loadMessages, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [selected]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const text = input.trim();
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: selected.type, id: selected.id }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((current) => [...current, newMessage]);
        setInput("");
      }
    } finally {
      setSending(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (uploading) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", selected.type);
      formData.append("id", selected.id);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const message = await res.json();
        setMessages((current) => [...current, message]);
      }
    } finally {
      setUploading(false);
      setDraggingFile(false);
    }
  };

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const startDm = async (user: UserSummary) => {
    const existingThread = dmByUserId.get(user.id);
    if (existingThread) {
      setSelected({ type: "dm", id: existingThread.id, peerId: user.id });
      return;
    }

    const res = await fetch("/api/chat/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: user.id }),
    });

    if (!res.ok) return;

    const thread = await res.json();
    const newThread = {
      id: thread.id,
      members: [
        { user },
        {
          user: {
            id: currentUser.id,
            username: currentUser.email ?? currentUser.id,
            realName: currentUser.name ?? null,
            role: currentUser.role ?? "STUDENT",
          },
        },
      ],
    };

    setDirectThreads((current) => [newThread, ...current]);
    setSelected({ type: "dm", id: thread.id, peerId: user.id });
  };

  const createChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || creatingChannel) return;

    setCreatingChannel(true);
    try {
      const res = await fetch("/api/chat/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChannelName,
          description: newChannelDescription,
          memberIds: newChannelMembers,
        }),
      });

      if (res.ok) {
        const channel = await res.json();
        setChannels((current) => [...current, channel]);
        setSelected({ type: "channel", id: channel.id });
        setNewChannelName("");
        setNewChannelDescription("");
        setNewChannelMembers([]);
        setChannelModalOpen(false);
      }
    } finally {
      setCreatingChannel(false);
    }
  };

  const conversationTitle = selected.type === "channel"
    ? selectedChannel?.name ?? "channel"
    : selectedPeer ? displayUser(selectedPeer) : "Direct message";

  const conversationDescription = selected.type === "channel"
    ? selectedChannel?.description ?? (selectedChannel?.isPrivate ? "指定已註冊成員可見" : "所有已註冊成員可見")
    : "私人訊息";

  return (
    <div
      className="grid h-full overflow-hidden bg-white md:grid-cols-[18rem_1fr]"
      onDragEnter={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) setDraggingFile(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) setDraggingFile(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setDraggingFile(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDraggingFile(false);
        if (e.dataTransfer.files.length > 0) {
          uploadFiles(e.dataTransfer.files);
        }
      }}
    >
      <aside className="flex min-h-0 flex-col border-b border-slate-800 bg-[#2b2d31] text-white md:border-b-0 md:border-r md:border-slate-950/40">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ec3750]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black">聊天室</h2>
              <p className="text-xs font-medium text-slate-400">
                {currentUser.name ?? currentUser.email}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between px-2 text-xs font-black uppercase text-slate-500">
              <span>Channels</span>
              {isLeader && (
                <button
                  type="button"
                  onClick={() => setChannelModalOpen(true)}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="新增頻道"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {channels.map((channel) => {
                const active = selected.type === "channel" && selected.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelected({ type: "channel", id: channel.id })}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${
                      active
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                    <span className="min-w-0 flex-1 truncate">{channel.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-2 px-2 text-xs font-black uppercase text-slate-500">Direct Messages</div>
            <div className="space-y-1">
              {users.map((user) => {
                const thread = dmByUserId.get(user.id);
                const active = selected.type === "dm" && selected.peerId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => startDm(user)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${
                      active
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#33d6a6]" />
                    <span className="min-w-0 flex-1 truncate">{displayUser(user)}</span>
                    {thread && <MessageCircle className="h-3.5 w-3.5 opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto rounded-2xl bg-[#232428] px-3 py-2 text-xs font-medium text-slate-400">
            {currentUser.name ?? currentUser.email}
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-0 flex-col">
        {draggingFile && (
          <div className="absolute inset-4 z-20 flex items-center justify-center rounded-3xl border-2 border-dashed border-[#ec3750] bg-white/85 text-center backdrop-blur-sm">
            <div>
              <FileUp className="mx-auto mb-3 h-10 w-10 text-[#ec3750]" />
              <p className="text-lg font-black text-slate-900">拖曳檔案以上傳</p>
              <p className="mt-1 text-sm font-medium text-slate-500">檔案會保存 30 天，之後自動失效。</p>
            </div>
          </div>
        )}
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 truncate text-lg font-black text-slate-900">
              {selected.type === "channel"
                ? selectedChannel?.isPrivate ? <Lock className="h-5 w-5 text-[#ec3750]" /> : <Hash className="h-5 w-5 text-[#ec3750]" />
                : <MessageCircle className="h-5 w-5 text-[#ec3750]" />}
              {conversationTitle}
            </h2>
            <p className="truncate text-sm font-medium text-slate-500">{conversationDescription}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 sm:flex">
            <Users className="h-4 w-4" />
            {selected.type === "channel" && selectedChannel?.isPrivate
              ? `${selectedChannel.members.length} members`
              : "online"}
          </div>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f2f3f5] p-5">
          {loadingMessages && (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            </div>
          )}
          {messages.length === 0 && !loadingMessages && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="font-bold text-slate-700">還沒有訊息</p>
              <p className="mt-1 text-sm text-slate-400">成為第一個開話題的人。</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.user.username === currentUser.email;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <span className="mb-1 px-1 text-xs text-slate-400">
                    {msg.user.realName || msg.user.username} · {new Date(msg.createdAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                    isMe
                      ? "rounded-tr-none bg-[#ec3750] text-white"
                      : "rounded-tl-none border border-slate-200 bg-white text-slate-800"
                  }`}>
                    {msg.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {msg.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={`/api/chat/files/${attachment.id}`}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                              isMe ? "bg-white/15 hover:bg-white/25" : "bg-slate-50 hover:bg-slate-100"
                            }`}
                          >
                            <FileUp className="h-4 w-4 flex-none" />
                            <span className="min-w-0 flex-1 truncate">{attachment.originalName}</span>
                            <span className="text-xs opacity-70">{Math.ceil(attachment.size / 1024)} KB</span>
                          </a>
                        ))}
                        <p className={`text-xs ${isMe ? "text-white/70" : "text-slate-400"}`}>保存 30 天</p>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-4">
          <label className="flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 p-3 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileUp className="h-6 w-6" />}
            <input
              type="file"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.currentTarget.files) {
                  uploadFiles(e.currentTarget.files);
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`傳訊息到 ${conversationTitle}...`}
            className="min-w-0 flex-1 rounded-xl bg-slate-100 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-[#ec3750]"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-[#ec3750] p-3 text-white transition-colors hover:bg-[#ff4d66] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </button>
        </form>
      </section>
      {isLeader && channelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <form onSubmit={createChannel} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">新增頻道</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  留空可見成員代表所有已註冊成員皆可觀看。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChannelModalOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-black text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                關閉
              </button>
            </div>
            <label className="mb-2 block text-sm font-black text-slate-700" htmlFor="channel-name">
              頻道名稱
            </label>
            <input
              id="channel-name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="例如：project-alpha"
              className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#ec3750] focus:bg-white"
            />
            <label className="mb-2 block text-sm font-black text-slate-700" htmlFor="channel-description">
              簡短說明
            </label>
            <input
              id="channel-description"
              value={newChannelDescription}
              onChange={(e) => setNewChannelDescription(e.target.value)}
              placeholder="這個頻道要討論什麼？"
              className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#ec3750] focus:bg-white"
            />
            <label className="mb-2 block text-sm font-black text-slate-700" htmlFor="channel-members">
              可見成員
            </label>
            <select
              id="channel-members"
              multiple
              value={newChannelMembers}
              onChange={(e) => {
                const selectedIds = Array.from(e.currentTarget.selectedOptions, (option) => option.value);
                setNewChannelMembers(selectedIds);
              }}
              className="h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#ec3750] focus:bg-white"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {displayUser(user)} ({user.username})
                </option>
              ))}
            </select>
            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-medium leading-relaxed text-slate-500">
              {newChannelMembers.length > 0
                ? `已選 ${newChannelMembers.length} 位成員；只有這些註冊用戶和你可以看見。`
                : "留空代表所有已註冊成員皆可觀看。聊天室不開放未登入者。"}
            </div>
            <button
              type="submit"
              disabled={creatingChannel || !newChannelName.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ec3750] px-4 py-3 text-sm font-black text-white transition-colors hover:bg-[#ff4d66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingChannel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              建立頻道
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
