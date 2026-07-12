"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

  function startNewChat() {
    setMessages([GREETING]);
    setInput("");
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 flex h-[32rem] w-80 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-semibold">Shopping Assistant</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={startNewChat}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                New chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
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

                  {message.products && message.products.length === 0 && (
                    <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                      No result
                    </p>
                  )}

                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-2 rounded-md bg-white p-1.5 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-800"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProductImage(product.images)}
                            alt={product.title}
                            className="h-10 w-10 shrink-0 rounded object-cover"
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
                          onClick={() => setIsOpen(false)}
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
              <div className="flex justify-start">
                <div className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  Thinking…
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
              className="flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 text-sm dark:border-zinc-800"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:bg-zinc-900 dark:ring-white/10 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
      >
        {isOpen ? (
          <span className="flex h-full w-full items-center justify-center bg-transparent text-zinc-700 dark:text-zinc-200">
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
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
        )}
      </button>
    </div>
  );
}
