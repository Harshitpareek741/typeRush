import React, { useContext, useEffect, useState, useRef } from "react";
import { generateRandomParagraph } from "../utils/paragraph";
import { unsupportedKeys } from "../utils/unsupportedkeys";
import { AppContext } from "../context/appContext";
import { io, Socket } from "socket.io-client";
import { FaLocationArrow } from "react-icons/fa";
import Stats from "../type-components/stats";

const socket: Socket = io("https://type-rush-backend.onrender.com/");

interface Props {
  user: { name: string; room: string };
  onLeave: () => void;
}

interface Message {
  name: string;
  text: string;
}

interface BroadcastData {
  name: string;
  text: number;
}

interface WordsMapEntry {
  typedLetter: string;
  supposedToBe: string;
}

const ChatRoom: React.FC<Props> = ({ user, onLeave }) => {
  // States
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [startedTyping, setStartedTyping] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0); // Track the start time
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [paragraph, setParagraph] = useState<string>("");
  const [data, setData] = useState<{ name: string; wpm: number }[]>([]);
  const [inRoom, setInRoom] = useState<boolean>(true);

  const { setWpm, setCpm, setAccuracy, setTimer, timer, wpm } =
    useContext(AppContext);

  const [state, setState] = useState<{
    letterIndex: number;
    wordsMap: Map<number, WordsMapEntry>;
  }>({
    letterIndex: 0,
    wordsMap: new Map(),
  });

  // Join the room and set up listeners
  useEffect(() => {
    socket.emit("enterRoom", { name: user.name, room: user.room });

    socket.on("userList", ({ users }: { users: { name: string }[] }) => {
      setUsers(users.map((u) => u.name));
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("change-screen-res", () => {
      setInRoom(false);
    });

    return () => {
      socket.off("userList");
      socket.off("message");
      socket.off("change-screen-res");
    };
  }, [user.room, user.name]);

  // Broadcast and receive WPM
  const handleBroadcast = (elements: BroadcastData) => {
    setData((prevData) => {
      const existingUser = prevData.find((item) => item.name === elements.name);
      if (existingUser) {
        return prevData.map((item) =>
          item.name === elements.name ? { ...item, wpm: elements.text } : item
        );
      } else {
        return [...prevData, { name: elements.name, wpm: elements.text }];
      }
    });
  };

  const handleScreen = () => {
    socket.emit("change-screen-req", { name: user.name, room: user.room });
    setInRoom((prev) => !prev);
  };

  useEffect(() => {
   
      socket.emit("sendwpm", { name: user.name, wpm, room: user.room });
      socket.on("brod", (data: BroadcastData) => {
        handleBroadcast(data);
      });
      
      return () => {
        socket.off("brod");
      };
    
    }, [timer]);
  

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { name: user.name, text: message });
      setMessage("");
    }
  };

  // Typing logic
  useEffect(() => {
    const { paragraph } = generateRandomParagraph();
    setParagraph(paragraph);
  }, []);
  
  useEffect(() => {
     
      if (startedTyping) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      }
    
    }, [startedTyping]);
  

  const handleKeyPress = (e: KeyboardEvent) => {

    if ( unsupportedKeys.includes(e.key)) return;
    const letters = paragraph.split("");
    if (!startedTyping) {
      setStartedTyping(true);
      setStartTime(Date.now());
    }
    if (e.key !== "Backspace") {
      setState((prev) => ({
        ...prev,
        letterIndex: prev.letterIndex + 1,
        wordsMap: prev.wordsMap.set(prev.letterIndex, {
          typedLetter: e.key,
          supposedToBe: letters[prev.letterIndex],
        }),
      }));
    } else if (e.key === "Backspace" && state.letterIndex > 0) {
      setState((prev) => ({
        ...prev,
        letterIndex: prev.letterIndex - 1,
        wordsMap: prev.wordsMap.set(prev.letterIndex, {
          typedLetter: "",
          supposedToBe: letters[prev.letterIndex],
        }),
      }));
    }
  };

  const calculatePerformance = () => {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Time in minutes
    const words = Array.from(state.wordsMap.values());
    let correctLetters = 0;
    let totalLetters = 0;

    words.forEach(({ typedLetter, supposedToBe }) => {
      if (typedLetter === supposedToBe) correctLetters++;
      totalLetters++;
    });

    const accuracy = (correctLetters / totalLetters) * 100 || 0;
    setWpm(Math.floor(correctLetters / 5 / elapsedTime));
    setCpm(Math.floor(correctLetters / elapsedTime));
    setAccuracy(Math.round(accuracy));
  };
  useEffect(() => {
    calculatePerformance();
    if (timer <= 0) {
      setStartedTyping(false);
    } else {
      window.addEventListener("keydown", handleKeyPress);
      cursorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  
  }, [state, timer]);
 
 


  return inRoom ? (
    <div className="h-screen w-screen   bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]  flex flex-col items-center justify-center">
      <div className="w-4/5 lg:w-3/5 lg:h-4/5 max-w-4xl p-6 bg-indigo-800 border border-white border-opacity-25 bg-opacity-5 shadow mt-10">
       <div className="flex flex-row justify-between mb-2">
        <h2 className="text-xl font-mono mb-3 text-white ">
          Room: {user.room} | Welcome, {user.name}
        </h2>

        <button className="font-mono transition rounded-lg p-1 mb-2 bg-gray-600 hover:bg-gray-700   ease-in delay-100  hover:text-white text-white" onClick={handleScreen}>Start Test</button>
        </div>
   

        <div className="flex h-full">
          {/* User List */}
          <div className="w-1/4 pr-4">
            <h3 className="font-mono mb-2 text-white">Users in Room:</h3>
            <ul className="bg-green-300 bg-opacity-20 p-2">
              {users.map((u, idx) => (
                <li key={idx} className="text-sm text-white font-mono">
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Section */}
          <div className="w-3/4 h-full  pl-4">
            <div className="h-5/6 overflow-y-scroll border bg-gray-600 bg-opacity-50 p-2 mb-4">
              {messages.map((msg, idx) => (
                <div className=" text-white font-mono" key={idx}>
                  <strong className="text-slate-400">{msg.name}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                onKeyDown={(e)=>{if(e.key==="Enter"){sendMessage();} console.log(e.key);}}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow bg-white bg-opacity-95 border rounded px-4 py-2 mr-2"
              />
              <button
                onClick={sendMessage} 
                className="px-4 py-2 bg-slate-700 rounded-full ease-in delay-100 text-white  hover:bg-slate-600"
              >
                <FaLocationArrow />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onLeave}
        className="mt-4 px-6 py-2 font-mono hover:bg-slate-900 hover:p-2 hover:rounded-full    text-red-700  rounded"
      >
        Leave Room
      </button>
    </div>
  ) : (
    <div className="flex h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] justify-between px-12">
    {/* Left Section */}
    <div className="flex flex-col mt-10 gap-6 w-4/6">
      <h6 className="text-center font-light text-[rgb(27,27,32)]">
        TYPING SPEED TEST
      </h6>
      <h1 className="text-6xl font-bold text-white text-center font-mono">
        Test your typing skills
      </h1>
  
      <Stats />
  
      {/* Typing Area */}
      <div
  className="shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(0,0,0,0.1)] rounded-lg h-36 flex items-center justify-center p-4"
  style={{ whiteSpace: "pre-wrap", overflow: "auto" }}
>
  <div className="items-center justify-center w-full">
    {paragraph.split("").map((letter, letterIndex) => (
      <span key={`${letter.concat(letterIndex.toString())}`}>
        <span
          className={`text-3xl p-0 m-0 font-thin ${
            letterIndex === state.letterIndex
              ? "text-white"
              : letterIndex > state.letterIndex
              ? "text-slate-400"
              : state.wordsMap.get(letterIndex)?.typedLetter ===
                state.wordsMap.get(letterIndex)?.supposedToBe
              ? "text-slate-600"
              : "text-red-500"
          }`}
        >
          {letterIndex === state.letterIndex && (
            <span
              ref={cursorRef}
              className="m-[0px] animate-cursor border-r-2 border-[rgb(27,27,32)]"
            />
          )}
          {letter === " " ? "\u00A0" : letter}
        </span>
      </span>
    ))}
  </div>
</div>
    </div>
  
    {/* Right Section */}
   <div className="w-2/6 gap-4 flex mt-10 justify-end">
   <div className="w-2/3">
     <h2 className="text-2xl font-bold text-white text-center mt-2">User Stats</h2>
     <div className="bg-neutral-900 mt-2 bg-opacity-55 border border-white border-opacity-55 p-4 rounded-lg shadow-md">
       {data
       .slice()
       .sort((a,b)=>(Number(b.wpm) - Number(a.wpm)))
       ?.map((ele) => (
         <div className="flex flex-row my-2 font-mono bg-slate-500 p-2 bg-opacity-40 text-white justify-between">
           <div>Name : {ele.name}</div>
           <div>Wpm : {ele.wpm}</div>
         </div>
       ))}
     </div>
   </div>
 </div>
 </div>
 
  
  );
};

export default ChatRoom;
