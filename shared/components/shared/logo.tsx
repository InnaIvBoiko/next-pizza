import React from 'react';

interface Props {
    className?: string;
}

/**
 * Brand logo. Served from /public/logo.svg so the same file powers both the
 * header mark and the favicon (see app/layout.tsx `metadata.icons`).
 */
export const Logo: React.FC<Props> = ({ className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src='/logo.svg' alt='Next Pizza' className={className} />
);
