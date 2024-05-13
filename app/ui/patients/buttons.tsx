import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  DocumentPlusIcon,
  ShareIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteNote } from '@/app/lib/actions';

export function AddPatientButton() {
  return (
    <Link
      href={'/dashboard/patients/add'}
      className={
        'flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600'
      }
    >
      <PlusIcon width={22} className="mr-2" />
      Add Patient
    </Link>
  );
}

export function ViewNotes({ patient_name }: { patient_name: string | null }) {
  return (
    <Link
      href={`./notes?query=${patient_name}`}
      className={`rounded-md border border-gray-200 p-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
    >
      notes
    </Link>
  );
}

export function ViewProfile({ patient_id }: { patient_id: string | null }) {
  return (
    <Link
      href={`/${patient_id}`}
      className={`rounded-md border border-gray-200 p-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
    >
      profile
    </Link>
  );
}

export function NewNote({ patient_id }: { patient_id: string | null }) {
  return (
    <Link
      href={`./createnote?patient=${patient_id}`}
      className={`rounded-md border border-gray-200 p-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
    >
      <PlusIcon width={16} />
      notes
    </Link>
  );
}
