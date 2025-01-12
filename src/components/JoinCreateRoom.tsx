import React, {  useState } from "react";

interface Props {
  onJoin: (name: string, room: string) => void;
}

const JoinCreateRoom: React.FC<Props> = ({ onJoin }) => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const handleJoin = () => {
    if (name.trim() && room.trim()) {
      onJoin(name, room);
    } else {
      alert("Please enter both your name and a room ID.");
    }
  };

 
  
 
  return (
    <div className="flex flex-col items-center justify-center  bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] h-screen w-screen "> 
     <div className="flex flex-col items-center justify-center h-4/6 w-3/6 border border-white border-opacity-25 lg:w-2/6 bg-blue-950 bg-opacity-10 ">
     <h1 className="text-2xl font-bold font-serif  mb-6 text-white ">Join or Create a Room</h1>
      <input 
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 text-white text-opacity-100 border rounded bg-opacity-10 bg-slate-400  w-64"
      />
      <input
        type="text"
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="mb-4 px-4 py-2 text-white text-opacity-100  bg-opacity-10 bg-slate-400  border rounded w-64"
      />
      <br></br>
      <button
        onClick={handleJoin}
        className="px-4 py-2 bg-slate-600 rounded-xl text-white  hover:bg-slate-700"
      >
        Join Room
      </button>
    </div>
     </div>
    
  );
};

export default JoinCreateRoom;
