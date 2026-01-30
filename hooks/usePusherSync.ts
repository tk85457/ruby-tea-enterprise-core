'use client';

import { useEffect } from 'react';
import { getPusherClient } from '@/lib/pusher';
import { mutate } from 'swr';
import { toast } from 'react-hot-toast'; // Assuming toast is available or will be added

export const usePusherSync = (channel: string, event: string, mutateKey: string) => {
  useEffect(() => {
    const pusher = getPusherClient();
    const sub = pusher.subscribe(channel);

    sub.bind(event, () => {
      mutate(mutateKey);
      // Optional: Show notification
    });

    return () => {
      sub.unbind(event);
      pusher.unsubscribe(channel);
    };
  }, [channel, event, mutateKey]);
};
