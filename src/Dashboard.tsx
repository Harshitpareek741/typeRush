import React, { useState } from "react";
import JoinCreateRoom from "./components/JoinCreateRoom";
import ChatRoom from "./components/ChatRoom";

const DashBoard: React.FC = () => {
  const [user, setUser] = useState<{ name: string; room: string } | null>(null);

  return (
    <div className="app">
      {!user ? (
        <JoinCreateRoom onJoin={(name, room) => setUser({ name, room })} />
      ) : (
        <ChatRoom user={user} onLeave={() => setUser(null)} />
      )}
    </div>
  );
};

export default DashBoard;
