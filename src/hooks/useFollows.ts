// Social follow system hook with Supabase
// Ported from desktop: localStorage -> AsyncStorage, useAuth -> AuthContext,
// notifyNewFollower uses mobile sendLocalNotification

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { sendLocalNotification } from '../services/notifications';

const FOLLOWS_CACHE_KEY = 'wsw-social-follows';

interface FollowCounts {
  [userId: string]: number;
}

/**
 * Notify a user that they have a new follower.
 * On mobile, we send a local notification if the current user is
 * also the target (edge case), but primarily we write to Supabase
 * notifications table so the target user sees it when they open the app.
 */
async function notifyNewFollower(
  targetUserId: string,
  followerId: string,
  followerName: string | null
): Promise<void> {
  try {
    // Write to Supabase notifications table so the target can see it later
    await supabase.from('notifications').insert({
      user_id: targetUserId,
      type: 'new_follower',
      title: 'New Follower',
      body: followerName
        ? `${followerName} started following you!`
        : 'Someone started following you!',
      data: { follower_id: followerId, follower_name: followerName },
      read: false,
    });
  } catch {
    // Non-critical -- best effort notification
  }
}

export function useFollows() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const [followerCounts, setFollowerCounts] = useState<FollowCounts>({});
  const [loading, setLoading] = useState(true);

  // Load who the current user follows
  const loadFollowing = useCallback(async () => {
    if (!user) {
      setFollowing([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;

      setFollowing((data || []).map((row: any) => row.following_id));
    } catch (error) {
      console.error('Error loading follows:', error);
      // Fall back to AsyncStorage for offline resilience
      try {
        const cached = await AsyncStorage.getItem(FOLLOWS_CACHE_KEY);
        if (cached) {
          setFollowing(JSON.parse(cached));
        } else {
          setFollowing([]);
        }
      } catch {
        setFollowing([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load follower counts for a set of user IDs
  const loadFollowerCounts = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) return;

    try {
      // Query follower counts grouped by following_id
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .in('following_id', userIds);

      if (error) throw error;

      const counts: FollowCounts = {};
      for (const row of data || []) {
        counts[row.following_id] = (counts[row.following_id] || 0) + 1;
      }
      // Ensure all requested IDs have an entry
      for (const id of userIds) {
        if (!(id in counts)) counts[id] = 0;
      }
      setFollowerCounts(prev => ({ ...prev, ...counts }));
    } catch (error) {
      console.error('Error loading follower counts:', error);
    }
  }, []);

  // Toggle follow/unfollow
  const toggleFollow = useCallback(async (targetUserId: string) => {
    if (!user) return;

    const isCurrentlyFollowing = following.includes(targetUserId);

    // Optimistic update
    if (isCurrentlyFollowing) {
      setFollowing(prev => prev.filter(id => id !== targetUserId));
      setFollowerCounts(prev => ({
        ...prev,
        [targetUserId]: Math.max(0, (prev[targetUserId] || 1) - 1),
      }));
    } else {
      setFollowing(prev => [...prev, targetUserId]);
      setFollowerCounts(prev => ({
        ...prev,
        [targetUserId]: (prev[targetUserId] || 0) + 1,
      }));
    }

    try {
      if (isCurrentlyFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });

        if (error) throw error;

        // Notify the followed user
        const userName = user.displayName || user.email?.split('@')[0] || null;
        notifyNewFollower(targetUserId, user.id, userName);
      }

      // Sync to AsyncStorage as cache
      const updated = isCurrentlyFollowing
        ? following.filter(id => id !== targetUserId)
        : [...following, targetUserId];
      await AsyncStorage.setItem(FOLLOWS_CACHE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert optimistic update
      if (isCurrentlyFollowing) {
        setFollowing(prev => [...prev, targetUserId]);
        setFollowerCounts(prev => ({
          ...prev,
          [targetUserId]: (prev[targetUserId] || 0) + 1,
        }));
      } else {
        setFollowing(prev => prev.filter(id => id !== targetUserId));
        setFollowerCounts(prev => ({
          ...prev,
          [targetUserId]: Math.max(0, (prev[targetUserId] || 1) - 1),
        }));
      }
    }
  }, [user, following]);

  // Check if current user follows a specific user
  const isFollowing = useCallback(
    (userId: string) => following.includes(userId),
    [following]
  );

  // Get follower count for a user
  const getFollowerCount = useCallback(
    (userId: string) => followerCounts[userId] ?? 0,
    [followerCounts]
  );

  useEffect(() => {
    loadFollowing();
  }, [loadFollowing]);

  return {
    following,
    followerCounts,
    loading,
    toggleFollow,
    isFollowing,
    getFollowerCount,
    loadFollowerCounts,
    followingCount: following.length,
  };
}

export default useFollows;
