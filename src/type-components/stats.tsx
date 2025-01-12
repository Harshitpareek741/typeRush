"use client"
import  { useContext, } from 'react'
import { AppContext } from '../context/appContext'
import CircularProgress from './circularProgress'

const Stats = () => {
    const { timer, wpm, cpm, accuracy } = useContext(AppContext)
    return (
        <div className='p-14 flex justify-center gap-4'>

            <CircularProgress value={timer} size={120} strokeWidth={5} >
                <h1 className=' text-4xl font-bold text-center text-white'>{timer}</h1>
                <h6 className='text-sm text-center font-mono text-white'>seconds</h6>
            </CircularProgress>
            <div className='w-28 flex flex-col justify-center bg-gray-800 rounded-full'>
                <h1 className='text-4xl font-bold text-center text-white'>{wpm}</h1>
                <h6 className='text-sm text-center font-mono text-white text-'>words/min</h6>
            </div>
            <div className='w-28 flex flex-col justify-center bg-gray-800 rounded-full'>
                <h1 className='text-4xl font-bold text-center text-white'>{cpm}</h1>
                <h6 className='text-sm text-center font-mono text-white'>chars/min</h6>
            </div>
            <div className='w-28 flex flex-col justify-center bg-gray-800 rounded-full'>
                <h1 className='text-4xl font-bold text-center text-white'>{accuracy}</h1>
                <h6 className='text-sm text-center font-mono text-white'>% accuracy</h6>
            </div>

        </div>
    )
}

export default Stats
