import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/prisma/prisma-client';
import { compare } from 'bcrypt';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('INVALID_CREDENTIALS');
                }

                const findUser = await prisma.user.findFirst({
                    where: { email: credentials.email },
                });

                // Same generic error for "not found" and "wrong password"
                // so attackers can't tell which emails are registered.
                if (!findUser) {
                    throw new Error('INVALID_CREDENTIALS');
                }

                // No password means the account was created via an OAuth
                // provider and can only be accessed through it.
                if (!findUser.password) {
                    throw new Error('OAUTH_ACCOUNT');
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    findUser.password
                );

                if (!isPasswordValid) {
                    throw new Error('INVALID_CREDENTIALS');
                }

                if (!findUser.verified) {
                    throw new Error('EMAIL_NOT_VERIFIED');
                }

                return {
                    id: String(findUser.id),
                    email: findUser.email,
                    name: findUser.fullName,
                    role: findUser.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === 'credentials') {
                    return true;
                }

                if (!user.email) {
                    return false;
                }

                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            {
                                provider: account?.provider,
                                providerId: account?.providerAccountId,
                            },
                            { email: user.email },
                        ],
                    },
                });

                if (findUser) {
                    await prisma.user.update({
                        where: {
                            id: findUser.id,
                        },
                        data: {
                            provider: account?.provider,
                            providerId: account?.providerAccountId,
                        },
                    });

                    return true;
                }

                await prisma.user.create({
                    data: {
                        email: user.email,
                        fullName: user.name || 'User #' + user.id,
                        // No password: this account can only sign in via OAuth.
                        verified: new Date(),
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                    },
                });

                return true;
            } catch (error) {
                console.error('Error [SIGNIN]', error);
                return false;
            }
        },
        async jwt({ token }) {
            if (!token.email) {
                return token;
            }

            const findUser = await prisma.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (findUser) {
                token.id = String(findUser.id);
                token.email = findUser.email;
                token.fullName = findUser.fullName;
                token.role = findUser.role;
            }

            return token;
        },
        session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }

            return session;
        },
    },
};
