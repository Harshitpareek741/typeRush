import React, { createContext, useMemo, useState } from "react";

export const AppContext = createContext({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wpm :0,
    setWpm: (wpm: number) => {console.log(wpm);},
    cpm: 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCpm: (cpm: number) => {console.log(cpm);},
    accuracy: 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setAccuracy: (accuracy: number) => {console.log(accuracy);},
    timer: 60,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setTimer: (timer: number | ((prevTimer: number) => number)) => {console.log(timer);},
    username: "", // Default empty string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUsername: (username: string) => {console.log(username);}, // Default empty setter
});

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [wpm, setWpm] = useState<number>(0);
    const [cpm, setCpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60);
    const [username, setUsername] = useState<string>(""); // Default username

    const value = useMemo(
        () => ({
            wpm, setWpm,
            cpm, setCpm,
            accuracy, setAccuracy,
            timer, setTimer,
            username, setUsername, // Providing username and its setter
        }),
        [wpm, cpm, accuracy, timer, username] // Ensure dependencies include username
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
