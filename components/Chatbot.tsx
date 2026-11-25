"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProductImage } from "@/lib/image";
import type { Product } from "@/lib/types";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  products?: Product[];
  viewAllHref?: string;
}

const GREETING: ChatMessage = {
  role: "bot",
  text: 'Hi! Tell me what you\'re looking for — e.g. "shoes under $50" or "electronics between 20 and 100".',
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isClosing, setIsClosing] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [chatId, setChatId] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const isExpanded = isOpen && !isClosing;

  // Keep the newest message (and its entrance animation) in view.
  useEffect(() => {
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  function openChat() {
    setIsOpen(true);
    setIsClosing(false);
    setHasOpened(true);
  }

  // The panel stays mounted until its exit animation ends.
  function closeChat() {
    setIsClosing(true);
  }

  function startNewChat() {
    setMessages([GREETING]);
    setInput("");
    setChatId((id) => id + 1);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
    setSentCount((count) => count + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply,
          products: data.products,
          viewAllHref: data.viewAllHref,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 flex flex-col items-end">
      {isOpen && (
        <div
          onAnimationEnd={(e) => {
            if (isClosing && e.target === e.currentTarget) {
              setIsOpen(false);
              setIsClosing(false);
            }
          }}
          className={`${isClosing ? "chat-panel-out" : "chat-panel-in"} mb-3 flex h-[32rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950`}
        >
          <div className="chat-aurora flex items-center justify-between px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="chat-online h-2 w-2 rounded-full bg-emerald-300" />
              <h2 className="text-sm font-semibold">Shopping Assistant</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={startNewChat}
                className="text-xs font-medium text-white/80 hover:text-white"
              >
                New chat
              </button>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="text-white/80 transition-all hover:rotate-90 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-3"
          >
            {messages.map((message, index) => (
              <div
                key={`${chatId}-${index}`}
                className={
                  message.role === "user"
                    ? "chat-msg-user flex justify-end"
                    : "chat-msg-bot flex justify-start"
                }
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-zinc-100 dark:bg-zinc-900"
                  }`}
                >
                  <p>{message.text}</p>

                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.products.map((product, i) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          style={{ animationDelay: `${150 + Math.min(i, 8) * 90}ms` }}
                          className="chat-product group/item flex items-center gap-2 rounded-md bg-white p-1.5 transition-all hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-md dark:bg-zinc-950 dark:hover:bg-zinc-800"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProductImage(product.images)}
                            alt={product.title}
                            className="h-10 w-10 shrink-0 rounded object-cover transition-transform group-hover/item:-rotate-3 group-hover/item:scale-110"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-black dark:text-white">
                              {product.title}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      {message.viewAllHref && (
                        <Link
                          href={message.viewAllHref}
                          onClick={closeChat}
                          className="block pt-1 text-xs font-medium underline text-black dark:text-white"
                        >
                          View all results
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg-bot flex justify-start">
                <div
                  role="status"
                  aria-label="Thinking"
                  className="flex gap-1 rounded-lg bg-zinc-100 px-3 py-3 dark:bg-zinc-900"
                >
                  <span className="chat-dot bg-violet-500" />
                  <span className="chat-dot bg-fuchsia-500 [animation-delay:150ms]" />
                  <span className="chat-dot bg-rose-500 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you looking for?"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 text-base dark:border-zinc-800 sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Send"
              className="flex items-center justify-center self-stretch overflow-hidden rounded-md bg-black px-3 text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {/* The key restarts the fly animation on every send. */}
              <svg
                key={sentCount}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-5 w-5 ${sentCount > 0 ? "chat-plane-fly" : ""}`}
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4Z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {!hasOpened && (
        <div
          aria-hidden="true"
          className="chat-teaser pointer-events-none mb-3 rounded-2xl rounded-br-sm border border-zinc-200 bg-white px-3 py-2 text-xs font-medium shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          Need help finding something? <span className="chat-wave">👋</span>
        </div>
      )}

      <div className={`relative ${isExpanded ? "" : "chat-float"}`}>
        {!isExpanded && (
          <>
            <span className="chat-halo" />
            <span className="chat-halo [animation-delay:1.2s]" />
          </>
        )}
        <button
          onClick={isExpanded ? closeChat : openChat}
          aria-label={isExpanded ? "Close chat" : "Open chat"}
          className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:bg-zinc-900 dark:ring-white/10 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
        >
          {isExpanded ? (
            <span className="chat-icon-spin flex h-full w-full items-center justify-center bg-transparent text-zinc-700 dark:text-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </span>
          ) : (
            <Image
              src="/chatbot.png"
              alt=""
              width={56}
              height={56}
              className="chat-icon-spin h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          )}
        </button>
      </div>
    </div>
  );
}
