"use client"
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function App(){
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/map');
  }, []);

  return (
    <>
    </>
  );
}