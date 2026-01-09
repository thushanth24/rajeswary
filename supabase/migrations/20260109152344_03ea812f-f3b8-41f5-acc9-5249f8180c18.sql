-- Add hall sections for multi-section halls

-- Get Kondavil hall ID and add 2 sections
INSERT INTO public.hall_sections (hall_id, name, display_order, is_active)
SELECT h.id, 'Section A', 1, true
FROM halls h WHERE h.slug = 'crystal-palace'
UNION ALL
SELECT h.id, 'Section B', 2, true
FROM halls h WHERE h.slug = 'crystal-palace';

-- Get Chelva Mahal hall ID and add 3 sections
INSERT INTO public.hall_sections (hall_id, name, display_order, is_active)
SELECT h.id, 'Section A', 1, true
FROM halls h WHERE h.slug = 'grand-ballroom'
UNION ALL
SELECT h.id, 'Section B', 2, true
FROM halls h WHERE h.slug = 'grand-ballroom'
UNION ALL
SELECT h.id, 'Section C', 3, true
FROM halls h WHERE h.slug = 'grand-ballroom';