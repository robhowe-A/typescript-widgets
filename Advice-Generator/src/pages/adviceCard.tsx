//--Copyright (c) Robert A. Howell  May, 2023
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import { adviceData } from './adviceData';
import { checkDataStringChangeNeeds } from './checkDataStrings';
import { apiGET } from './apiGET';

let dataSeed: adviceData = {slip: { id: -1, advice: "There is no advice."}, prevState: null};

const inter = Inter({ subsets: ['latin'] });

export default function AdviceCardComp() {
  const [data, setData] = useState<adviceData>(dataSeed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchAdvice() {
    let dataPromise = new Promise<adviceData>((resolve, reject) => {
      resolve(apiGET());
      reject(new Error("Promise rejected."));
    })
    dataPromise
      .then((data) => {
      let returnedAdvice: adviceData = data;
      returnedAdvice = checkDataStringChangeNeeds(returnedAdvice);
      setData(returnedAdvice);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchAdvice()
      }, []);
      
      if (loading) return "Loading...";
      if (error) return "Error!";

      if(data?.slip.advice){
        data.slip.advice.trim();
      }

  return (
    <aside id={styles.adviceCard}>
        <div>
        {/* Advice ID goes here */}
        <span id={styles.adviceId}>Advice # {data?.slip.id}</span>
        <p id={styles.advice}><q>{data?.slip.advice}</q></p>
        </div>
        {/* patterndivider - mobile */}
        <svg id={styles.desktopPattern} width="444" height="16" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path fill="#4F5D74" d="M0 8h196v1H0zM248 8h196v1H248z"/><g transform="translate(212)" fill="#CEE3E9"><rect width="6" height="16" rx="3"/><rect x="14" width="6" height="16" rx="3"/></g></g></svg>
        <div onClick={e => fetchAdvice()} id={styles.iconDiceCont}>
            <svg id={styles.iconDice} width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 0H4a4.005 4.005 0 0 0-4 4v16a4.005 4.005 0 0 0 4 4h16a4.005 4.005 0 0 0 4-4V4a4.005 4.005 0 0 0-4-4ZM7.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="#202733"/></svg>
        </div>
    </aside>
  )
}
