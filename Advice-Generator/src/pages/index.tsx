//--Copyright (c) Robert A. Howell  May, 2023
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import AdviceCardComp from './adviceCard';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {

  return (
    <>
      <Head>
      <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png" />
        <title>Frontend Mentor | Advice generator app</title>
      </Head>
      
      <main className={`${styles.main} ${inter.className}`}>
          <AdviceCardComp></AdviceCardComp>

          <div className={styles.attribution}>
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>.
            Coded by <a href="#">Your Name Here</a>.
          </div>
        </main>
    </>
  )
}
