-- Delete old placeholder images for Chelva Palace and Chelva Mahal
DELETE FROM hall_images WHERE hall_id IN (
  '86d57f02-089c-4817-bf33-d403c9093541', -- Chelva Palace
  '23bac0a2-9065-4e0a-8de8-8ef73fe4949f'  -- Chelva Mahal
);

DELETE FROM hall_event_photos WHERE hall_id IN (
  '86d57f02-089c-4817-bf33-d403c9093541', -- Chelva Palace
  '23bac0a2-9065-4e0a-8de8-8ef73fe4949f'  -- Chelva Mahal
);