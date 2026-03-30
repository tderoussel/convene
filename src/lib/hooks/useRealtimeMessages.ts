"use client";

import { useEffect, useRef } from "react";
import { USE_SUPABASE } from "@/lib/feature-flags";
import { createClient } from "@/lib/supabase/client";
import type { RoomMessage } from "@/types";

/**
 * Subscribe to real-time INSERT/UPDATE/DELETE on room_messages for a given room.
 * Only active when USE_SUPABASE is true; otherwise it's a no-op.
 */
export function useRealtimeMessages(
  roomId: string,
  callbacks: {
    onInsert: (msg: RoomMessage) => void;
    onUpdate: (msg: RoomMessage) => void;
    onDelete: (oldMsg: { id: string }) => void;
  }
) {
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    if (!USE_SUPABASE) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`room-messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          cbRef.current.onInsert(payload.new as RoomMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          cbRef.current.onUpdate(payload.new as RoomMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          cbRef.current.onDelete(payload.old as { id: string });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);
}
