import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Stub] Sending welcome email to ${to} (${name})`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Skill Tank <noreply@skilltank.com>",
      to: [to],
      subject: "Welcome to Skill Tank!",
      html: `
        <div>
          <h2>Welcome, ${name}!</h2>
          <p>Your account has been successfully created on Skill Tank.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email", error);
    return { success: false, error };
  }
}

export async function sendPlacementAlert(to: string, studentName: string, company: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Stub] Sending placement alert to ${to} for ${studentName} at ${company}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Skill Tank <noreply@skilltank.com>",
      to: [to],
      subject: "New Placement Alert!",
      html: `
        <div>
          <h2>Great News!</h2>
          <p><strong>${studentName}</strong> has been placed at <strong>${company}</strong>.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email", error);
    return { success: false, error };
  }
}
