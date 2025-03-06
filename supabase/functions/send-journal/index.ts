
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JournalEmailRequest {
  to: string;
  text: string;
  mood?: string;
  date: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, text, mood, date }: JournalEmailRequest = await req.json();

    if (!to || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to and text" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending journal to ${to} with date ${date}`);

    const emailResponse = await resend.emails.send({
      from: "Journal <onboarding@resend.dev>",
      to: [to],
      subject: `Journal Entry - ${new Date(date).toLocaleDateString()}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">
          <h1 style="color: #333;">Your Journal Entry</h1>
          <p style="color: #666;">${new Date(date).toLocaleDateString()}</p>
          ${mood ? `<p style="color: #666;">Mood: ${mood}</p>` : ''}
          <div style="white-space: pre-wrap; margin-top: 20px; color: #333;">
            ${text}
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-journal function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
