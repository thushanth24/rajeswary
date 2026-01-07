-- Delete old placeholder images for Tellipalai and Karpaka halls
DELETE FROM hall_images WHERE hall_id IN ('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'b3938423-dfa7-468c-ada1-a8e3791131e0');
DELETE FROM hall_event_photos WHERE hall_id IN ('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'b3938423-dfa7-468c-ada1-a8e3791131e0');