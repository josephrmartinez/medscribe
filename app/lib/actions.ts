'use server'

import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  
});

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
)

interface Word {
  end: number;
  start: number;
  word: string;
}

interface Segment {
  end: string;
  start: string;
  text: string;
  words?: Word[];
  speaker: string;
}

interface TranscriptOutput {
  language: string;
  segments: Segment[];
  num_speakers: number;
}

function reformatTimestamps(transcriptOutput: TranscriptOutput): void {
  for (const segment of transcriptOutput.segments) {
    segment.start = secondsToHHMMSS(parseFloat(segment.start));
    segment.end = secondsToHHMMSS(parseFloat(segment.end));
  }
}

function secondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


export default async function getTranscript(url: string, apptid: string) {
  console.log("running transcription API");

  try {
  const output = await replicate.run(
    "thomasmol/whisper-diarization:7fa6110280767642cf5a357e4273f27ec10ebb60c107be25d6e15f928fd03147",
    {
      input: {
        file_url: url,
      },
    }
  ) as TranscriptOutput;

  output.segments.forEach((segment) => delete segment.words);
  
  reformatTimestamps(output)

  console.log("output:", output);
  await updateApptWithTranscript(apptid, output);
} catch (error) {
  console.error("Error in getTranscript:", error);
  // Handle error appropriately
}
}


async function updateApptWithTranscript(apptid: string, output: object){
  console.log("updating appointment with transcript")
  const { data, error } = await supabase
  .from("appointments")
  .update({transcript: output})
  .eq('id', apptid)
  .select();

if (error) {
  console.error("Error adding transcript:", error);
  // Handle error accordingly
} else {
  console.log("Transcript added successfully:", data);
}
}












// 'use server';

// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { AuthError } from 'next-auth';



// export type State = {
//   errors?: {
//     customerId?: string[];
//     amount?: string[];
//     status?: string[];
//   };
//   message?: string | null;
// };

// const FormSchema = z.object({
//     id: z.string(),
//     customerId: z.string({
//         invalid_type_error: 'Please select a customer.'
//     }),
//     amount: z.coerce
//         .number()
//         .gt(0, {message: 'Please enter an amount greater than 0'}),
//     status: z.enum(['pending', 'paid'], {
//         invalid_type_error: 'Please select an invoice status'
//     }),
//     date: z.string(),
//   });
   
// const CreateInvoice = FormSchema.omit({ id: true, date: true });
// const UpdateInvoice = FormSchema.omit({ date: true, id: true });

// export async function createInvoice(prevState: State, formData: FormData) {
//     // Validate form using Zod 
//     const validatedFields = CreateInvoice.safeParse({
//         customerId: formData.get('customerId'),
//         amount: formData.get('amount'),
//         status: formData.get('status'),
//       });

//     //   If form validation fails, returrn errors early. Otherwise, continue.
//       if (!validatedFields.success) {
//         return {
//           errors: validatedFields.error.flatten().fieldErrors,
//           message: 'Missing Fields. Failed to Create Invoice.',
//         };
//       }

//     //   Prepare data for insertion into database
//       const { customerId, amount, status } = validatedFields.data;
//       const amountInCents = amount * 100;
//       const date = new Date().toISOString().split('T')[0];

//     //   Insert data into the database
//       try {
//         await sql`
//         INSERT INTO invoices (customer_id, amount, status, date)
//         VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//         `;
//       } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice'
//         }
//       }
      
//     //   Revalidate the cache for the invoices page and redirect the user
//       revalidatePath('/dashboard/invoices');
//       redirect('/dashboard/invoices');
// }


// export async function updateInvoice(
//   id: string,
//   prevState: State,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Invoice.',
//     };
//   }

//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await sql`
//       UPDATE invoices
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: 'Database Error: Failed to Update Invoice.' };
//   }

//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }



//   export async function deleteInvoice(id: string) {
//     try {
//         await sql`DELETE FROM invoices WHERE id = ${id}`;
//         revalidatePath('/dashboard/invoices');
//         return { message: "Deleted Invoice" }
//     } catch (error) {
//         return {
//             message: 'Failed to Delete Invoice'
//         }
//     }
//   }



//   export type ApptState = {
//     errors?: {
//       title?: string[];
//       description?: string[];
//       provider?: string[];
//       clinic?: string[];
//       appointment_date?: string[];
//       amount?: string[];
//     };
//     message?: string | null;
//   };
  
//   const ApptFormSchema = z.object({
//       id: z.string(),
//       title: z.string({
//           invalid_type_error: 'Please provide a title.'
//       }),
//       description: z.string({
//         invalid_type_error: 'Please provide a description.'
//       }),
//       provider: z.string({
//         invalid_type_error: 'Please indicate a provider.'
//       }),
//       clinic: z.string({
//         invalid_type_error: 'Please indicate a clinic.'
//       }),
//       appointment_date: z.string().optional(),
//       amount: z.coerce.number(),
//       audio_path: z.string().optional(),
//       patient_id: z.string().optional(),
//       speakers: z.coerce.number().nullable(),
//       transcript: z.string().optional(),
//       summary: z.string().optional(),
//       feedback: z.string().optional(),
//     });
     
    
  // const CreateAppointment = ApptFormSchema.omit({ id: true, patient_id: true, speakers: true, transcript: true, summary: true, feedback: true, audio_path: true  });
  // const UpdateAppointment = ApptFormSchema.omit({ patient_id: true, speakers: true, transcript: true, summary: true, feedback: true, audio_path: true, id: true });


  // export async function createAppointment(prevState: ApptState, formData: FormData) {
  //     // Validate form using Zod 
  //     const validatedFields = CreateAppointment.safeParse({
  //         title: formData.get('title'),
  //         description: formData.get('description'),
  //         provider: formData.get('provider'),
  //         clinic: formData.get('clinic'),
  //         appointment_date: formData.get('appointment_date'),
  //         amount: formData.get('amount'),
  //         // audio_path: formData.get('audio_path'),
  //       });
  
  //       // console.log("validated fields:", validatedFields)
  
  
  //     //   If form validation fails, return errors early. Otherwise, continue.
  //       if (!validatedFields.success) {
  //         console.error("Validation errors:", validatedFields.error.errors)
  //         return {
  //           errors: validatedFields.error.flatten().fieldErrors,
  //           message: 'Missing Fields. Failed to Create Appointment.',
  //         };
  //       }
  
  //     //   Prepare data for insertion into database
  //       const { title, description, provider, clinic, appointment_date, amount } = validatedFields.data;
  //       const amountInCents = amount * 100;
  
  //     //   Insert data into the database
  //       try {
  //         await sql`
  //         INSERT INTO appointments (title, description, provider, clinic, appointment_date, amount)
  //         VALUES (${title}, ${description}, ${provider}, ${clinic}, ${appointment_date}, ${amountInCents})
  //         `;
  //       } catch (error) {
  //         console.error('Database error:', error)
  //         return {
  //             message: 'Database Error: Failed to Create Appointment'
  //         }
  //       }
        
  //     //   Revalidate the cache for the invoices page and redirect the user
  //       revalidatePath('/dashboard/appointments');
  //       redirect('/dashboard/appointments');
  // }
  



 

  export async function updateAppointment(
    id: string, 
    prevState: ApptState, 
    formData: FormData
    ): Promise<ApptState> {
      console.log("calling updateAppointment")
    const validatedFields = UpdateAppointment.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      provider: formData.get('provider'),
      clinic: formData.get('clinic'),
      appointment_date: formData.get('appointment_date'),
      amount: formData.get('amount'),
      // audio_path: formData.get('audio_path'),
    });
    if(!validatedFields.success){
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }
   
    //   Prepare data for insertion into database
    const { title, description, provider, clinic, appointment_date, amount } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
      await sql`
      UPDATE appointments
      SET title=${title}, description=${description}, provider=${provider}, clinic=${clinic}, appointment_date=${appointment_date}, amount=${amountInCents}
      WHERE id=${id}
      `;
    } catch (error) {
      console.error('Database error:', error)
      return {
          message: 'Database Error: Failed to Create Appointment'
      }
    }
    return prevState;
  }


  export async function deleteAppointment(id: string) {
    try {
        await sql`DELETE FROM appointments WHERE id = ${id}`;
        revalidatePath('/dashboard/appointments');
        return { message: "Deleted Appointment" }
    } catch (error) {
        return {
            message: 'Failed to Delete Appointment'
        }
    }
  }
  

  

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    let responseRedirectUrl = null;
    try {
      console.log("form data", formData)
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }