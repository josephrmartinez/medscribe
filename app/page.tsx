import Logo from '@/app/ui/logo';
import {
  ArrowRightIcon,
  PencilSquareIcon,
  MicrophoneIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { PricingCard } from './ui/PricingCard';
import { UseStep } from './ui/UseStep';
import Link from 'next/link';
import Image from 'next/image';
import Header from './ui/Header';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    redirect('/dashboard/notes');
  }

  return (
    <main className="bg-gray-100 p-2">
      <Header />

      {/* Mobile view */}
      <div className="mx-auto mb-12 grid md:hidden">
        <div className="mx-auto mb-8 mt-20 px-6 text-center text-3xl font-black text-gray-600">
          <p>Automate your</p>
          <p>clinical charting.</p>
        </div>
        <div className="mx-auto my-6 text-center text-2xl font-semibold text-gray-500">
          <p>Go from audio memo</p>
          <p>to structured SOAP note</p>
          <p>in seconds.</p>
        </div>

        <div className="mx-auto my-8 flex flex-row items-center justify-center pb-8 align-middle">
          <Link
            href="/signup"
            className=" mx-2 w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white hover:bg-teal-500 hover:text-white"
          >
            get started
          </Link>
          <Link
            href="#plan"
            className="mx-2 w-32 rounded-full py-4 font-bold underline underline-offset-8 hover:text-teal-600"
          >
            see pricing
          </Link>
        </div>
        {/* <p className="mx-auto mb-8 mt-20 text-center text-3xl font-bold text-gray-600 dark:text-gray-400">
          Easy to use. No setup required.
        </p> */}
        <div className="mx-auto flex w-11/12 flex-col items-center">
          <Image
            alt="soapscribe demo"
            width={1000}
            height={1000}
            src="/soapscribedemo.gif"
            unoptimized={true}
            className="rounded-lg shadow-lg"
          ></Image>
        </div>
        <div className="mx-auto my-12 grid max-w-screen-lg gap-8 px-8 md:mt-8 md:grid-cols-3">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload clinical audio memos or an entire appointment recording. Soapscribe will intelligently extract the relevant information."
          />

          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Review draft"
            subtext="A structured SOAP note is available in seconds for easy review. Make quick edits instead of starting notes from scratch."
          />

          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve note"
            subtext="Notes are saved in a HIPPA-compliant database that is simple to search. No complex setup or onboarding required."
          />
        </div>

        <div className="mb-4 py-6">
          <div
            id="plan"
            className="mx-auto mb-6 text-center text-xl font-semibold text-gray-600"
          >
            <p>A simple charting solution for</p>
            <p>independent healthcare providers:</p>
          </div>
          <div className="grid w-full gap-4 text-center text-gray-700">
            <p className="">First ten notes free, then $49 per month.</p>
            <p className="">No complex setup. No contracts. No lock-in.</p>
            <p className="">Freely export notes to other EHR platforms.</p>
          </div>
        </div>
        <Link
          href="/signup"
          className="mx-auto w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white hover:bg-teal-500 hover:text-white"
        >
          get started
        </Link>
      </div>

      {/* Desktop view */}
      <div className="mx-auto mb-16 hidden md:grid">
        <p className="mx-auto mb-8 mt-20 px-6 text-center text-5xl font-black text-gray-600 ">
          Automate your clinical charting.
        </p>
        <p className="mx-auto my-12 text-center  text-2xl font-semibold text-gray-500 md:text-3xl">
          Go from audio memo to structured SOAP note in seconds.
        </p>

        <div className="mx-auto my-8 flex flex-row items-center justify-center pb-8 align-middle">
          <Link
            href="/signup"
            className=" mx-2 w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white hover:bg-teal-500 hover:text-white"
          >
            get started
          </Link>
          <Link
            href="#pricing"
            className="mx-2 w-32 rounded-full py-4 font-bold underline underline-offset-8 hover:text-teal-600"
          >
            see pricing
          </Link>
        </div>
        {/* <p className="mx-auto mb-8 mt-20 text-center text-3xl font-bold text-gray-600 dark:text-gray-400">
          Easy to use. No setup required.
        </p> */}
        <div className="mx-auto flex w-11/12 flex-col items-center">
          <Image
            alt="soapscribe demo"
            width={1000}
            height={1000}
            src="/soapscribedemo.gif"
            unoptimized={true}
            className="rounded-lg shadow-lg"
          ></Image>
        </div>
        <div className="mx-auto mt-12 grid max-w-screen-lg gap-8 px-8 md:mt-8 md:grid-cols-3">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload clinical audio memos or an entire appointment recording. Soapscribe will intelligently extract the relevant information."
          />

          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Review draft"
            subtext="A structured SOAP note is available in seconds for easy review. Make quick edits instead of starting notes from scratch."
          />

          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve note"
            subtext="Notes are saved in a HIPPA-compliant database that is simple to search. No complex setup or onboarding required."
          />
        </div>

        <div className="mx-auto mb-8 mt-20 w-7/12 text-center text-3xl font-bold text-gray-600">
          <p>A simple charting solution for </p>
          <p>independent healthcare providers:</p>
        </div>
        <div
          id="pricing"
          className="mx-auto mb-12 grid w-full gap-6 text-center text-xl text-gray-700"
        >
          <p className="">First ten notes free, then $49 per month.</p>
          <p className="">No complex setup. No contracts. No lock-in.</p>
          <p className="">Freely export notes to other EHR platforms.</p>
        </div>
        <Link
          href="/signup"
          className="mx-auto w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white hover:bg-teal-500 hover:text-white"
        >
          get started
        </Link>
      </div>
    </main>
  );
}
