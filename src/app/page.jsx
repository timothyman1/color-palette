"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/Animations";
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import { useFetchColor } from "@/utils/useFetchColor";

export default function ColorPaletteChat() {
  const [messages, setMessages] = useState([]);
  const [currentPalette, setCurrentPalette] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const scrollAreaRef = useRef(null);
  const blockRefs = useRef({});

  const [
    result,
    isPending,
    userText,
    setUserText,
    movie,
    setMovie,
    classify,
    error,
  ] = useFetchColor();

  const generateRandomPalette = useCallback(
    async (usrText, film) => {
      const res = await classify(usrText, film);
      return {
        colors: res,
        usrText,
        film,
      };
    },
    [classify],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userText.trim()) return;

      const userMessageId = `user-${Date.now()}`;
      const aiMessageId = `ai-${Date.now()}`;
      const userMessage = {
        id: userMessageId,
        role: "user",
        content: userText,
      };
      setMessages((prev) => [...prev, userMessage]);

      const newPalette = await generateRandomPalette(userText, movie);

      if (!newPalette) return;

      // Mock AI response - in a real app, this would be an API call
      // const newPalette = {
      //   colors: Array(5)
      //     .fill(0)
      //     .map(
      //       () =>
      //         `#${Math.floor(Math.random() * 16777215)
      //           .toString(16)
      //           .padStart(6, "0")}`,
      //     ),
      //   prompt: userText,
      // };

      const aiMessage = {
        id: aiMessageId,
        role: "assistant",
        content: `Here's a color palette based on your prompt: "${userText}"`,
        colorPalette: newPalette,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCurrentPalette(newPalette);
      setActiveBlockId(aiMessageId);
      setUserText("");
      setMovie("");
      setSelectedColorIndex(null);
    },
    [userText, movie],
  );

  const handleColorChange = useCallback((index, color) => {
    setCurrentPalette((prev) => {
      if (!prev) return prev;
      const newColors = [...prev.colors];
      newColors[index] = color;
      return { ...prev, colors: newColors };
    });
  }, []);

  const handlePaletteSelect = useCallback((messageId, palette) => {
    setCurrentPalette(palette);
    setSelectedColorIndex(null);
    setActiveBlockId(messageId);
  }, []);

  const handleReload = useCallback(async (messageId, usrText, film) => {
    const newPalette = await generateRandomPalette(usrText, film);

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, colorPalette: newPalette } : msg,
      ),
    );
    setCurrentPalette(newPalette);
    // setActiveBlockId(messageId);
  }, []);

  const scrollToBlock = useCallback((id) => {
    const block = blockRefs.current[id];
    if (block) {
      block.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (activeBlockId) {
      scrollToBlock(activeBlockId);
    }
  }, [activeBlockId, scrollToBlock]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        const lastMessageId = lastMessage.id;
        scrollToBlock(lastMessageId);
      }
    }
  }, [messages, scrollToBlock]);

  const navigateBlocks = useCallback(
    (direction) => {
      const userMessageIds = messages
        .filter((m) => m.role === "user")
        .map((m) => m.id);
      const currentIndex = activeBlockId
        ? userMessageIds.indexOf(activeBlockId)
        : -1;
      let newIndex;

      if (direction === "up") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      } else {
        newIndex =
          currentIndex < userMessageIds.length - 1
            ? currentIndex + 1
            : userMessageIds.length - 1;
      }

      const newActiveId = userMessageIds[newIndex];
      setActiveBlockId(newActiveId);
      scrollToBlock(newActiveId);
    },
    [activeBlockId, messages, scrollToBlock],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <FadeIn>
        <h1 className="text-7xl font-extrabold mb-8 text-shadow-basic text-background tracking-widest text-center ">
          Cinema Palette
        </h1>
      </FadeIn>

      <motion.div
        className="w-full max-w-4xl rounded-3xl p-8 nuph"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/*<ScrollArea className="h-[500px] w-full pr-4 mb-6 rounded-2xl shadow-indent p-4">*/}
        <ScrollArea
          className="h-[500px] w-full pr-4 mb-6 rounded-2xl shadow-indent p-4"
          ref={scrollAreaRef}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
                ref={(el) => (blockRefs.current[message.id] = el)}
              >
                {message.role === "user" ? (
                  <div className="text-right">
                    <span
                      className={`text-foreground inline-block px-4 py-2 rounded-2xl bg-accent dark:bg-white/5 font-sans dark:backdrop-blur-md`}
                    >
                      {message.content}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="text-left mb-4">
                      <span
                        className={`text-foreground inline-block px-4 py-2 rounded-2xl bg-accent dark:bg-white/5 font-sans dark:backdrop-blur-md`}
                      >
                        {message.content}
                      </span>
                    </div>
                    {message.colorPalette && (
                      <div
                        className={`mx-6 p-4 w-fit rounded-2xl  cursor-pointer flex justify-center items-center  gap-4  transition-all ${
                          activeBlockId === message.id ? "nuph" : ""
                        }`}
                        onClick={() =>
                          handlePaletteSelect(message.id, message.colorPalette)
                        }
                      >
                        <div className="flex gap-3 h-8">
                          {message.colorPalette.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full shadow-basic"
                            >
                              <div
                                className="w-full h-full rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            onClick={(e) => {
                              handleReload(
                                message.id,
                                message.colorPalette.usrText,
                                message.colorPalette.film,
                              );
                            }}
                            className="py-0 h-9 text-foreground rounded-full active:bg-gradient-custom transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        {currentPalette && (
          <motion.div
            className="flex justify-center space-x-6 mb-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!isPending ? (
              <Fragment>
                {currentPalette.colors.map((color, index) => (
                  <div key={index} className="relative group">
                    <div className="w-16 h-16 rounded-full shadow-basic p-1 transition-all duration-200">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                          className="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0"
                        />
                        <div
                          className="w-full h-full rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm  group-hover:opacity-100 transition-opacity">
                      {color}
                    </span>
                  </div>
                ))}
              </Fragment>
            ) : (
              <div className="h-16 flex items-center justify-center">
                <p>Loading...</p>
              </div>
            )}

            {error && (
              <div className="h-16 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <div className="absolute right-0 top-1/2 -translate-y-1/2 justify-center space-x-4 mb-4">
              <Button
                onClick={() => navigateBlocks("up")}
                className="rounded-full p-2 nuph text-foreground transition-all"
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => navigateBlocks("down")}
                className="rounded-full p-2 nuph text-foreground transition-all"
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Describe a movie or director's style..."
            className="flex-grow  shadow-indent placeholder:text-foreground border-none rounded-xl px-6 py-3 focus:outline-none focus:ring-0"
          />
          <Input
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Specify movie"
            className="w-80 shadow-indent placeholder:text-foreground border-none rounded-xl px-6 py-3 focus:outline-none focus:ring-0"
          />

          <Button type="submit" className="nuph text-foreground">
            Inspire
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
