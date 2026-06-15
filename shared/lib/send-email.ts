import { Resend } from 'resend';
import React from 'react';

/**
 * Sends a transactional email rendered from a React template.
 *
 * Dev fallback: when RESEND_API_KEY is missing we don't hit Resend — we just log
 * so flows like registration keep working locally without configuring a provider.
 */
export async function sendEmail(
    to: string,
    subject: string,
    template: React.ReactNode
) {
    const apiKey = process.env.RESEND_API_KEY;

    // Treat a missing OR placeholder/invalid key (real keys are "re_" + ~30 chars)
    // as "no key" and fall back to logging — so a junk value never breaks the flow.
    if (!apiKey || !apiKey.startsWith('re_') || apiKey.length < 20) {
        console.log(
            `[sendEmail:dev] to=${to} subject="${subject}" (no valid RESEND_API_KEY, email not sent)`
        );
        return;
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM ?? 'Next Pizza <onboarding@resend.dev>',
        to,
        subject,
        react: template,
    });

    if (error) {
        throw error;
    }

    return data;
}
