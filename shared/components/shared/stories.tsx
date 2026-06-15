'use client';

import { IStory } from '@/shared/services/stories';
import * as storiesService from '@/shared/services/stories';
import React from 'react';
import { Container } from './container';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import ReactStories from 'react-insta-stories';
import Image from 'next/image';

interface Props {
    className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
    const [stories, setStories] = React.useState<IStory[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedStory, setSelectedStory] = React.useState<IStory>();

    React.useEffect(() => {
        async function fetchStories() {
            const data = await storiesService.getAll();
            setStories(data);
        }

        fetchStories();
    }, []);

    const onClickStory = (story: IStory) => {
        setSelectedStory(story);

        if (story.items.length > 0) {
            setOpen(true);
        }
    };

    return (
        <>
            <Container
                className={cn(
                    'my-10 flex items-center justify-between gap-2',
                    className
                )}
            >
                {stories.length === 0 &&
                    [...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className='h-62.5 w-50 animate-pulse rounded-md bg-gray-200'
                        />
                    ))}

                {stories.map(story => (
                    <Image
                        key={story.id}
                        onClick={() => onClickStory(story)}
                        className='cursor-pointer rounded-md'
                        height={250}
                        width={200}
                        src={story.previewImageUrl}
                        alt={''}
                    />
                ))}

                {open && (
                    <div className='absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center bg-black/80'>
                        <div className='relative' style={{ width: 520 }}>
                            <button
                                className='absolute -top-5 -right-10 z-30'
                                onClick={() => setOpen(false)}
                            >
                                <X className='absolute top-0 right-0 h-8 w-8 text-white/50' />
                            </button>

                            <ReactStories
                                onAllStoriesEnd={() => setOpen(false)}
                                stories={
                                    selectedStory?.items.map(
                                        (item: IStory['items'][number]) => ({
                                            url: item.sourceUrl,
                                        })
                                    ) || []
                                }
                                defaultInterval={3000}
                                width={520}
                                height={800}
                            />
                        </div>
                    </div>
                )}
            </Container>
        </>
    );
};
