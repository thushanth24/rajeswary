-- Insert sample hall images for all halls
INSERT INTO public.hall_images (hall_id, image_url, caption, display_order) VALUES
-- Karpaka Raajeshwariy (emerald-garden)
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 'Elegant entrance with floral decorations', 1),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'Main hall with traditional setup', 2),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'Beautifully decorated stage area', 3),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', 'Dining area with royal seating', 4),
-- Raajeshwariy Tellipalai (sunset-terrace)
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', 'Outdoor terrace view', 1),
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', 'Garden wedding setup', 2),
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800', 'Evening lights ambiance', 3),
-- Raajeshwariy Kondavil (crystal-palace)
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', 'Crystal chandelier hall', 1),
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Intimate ceremony space', 2),
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', 'Bridal preparation room', 3),
-- Chelva Mahal (grand-ballroom)
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'Grand ballroom full view', 1),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', 'Wedding ceremony setup', 2),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'Reception hall arrangement', 3),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', 'VIP lounge area', 4),
-- Chelva Palace (royal-banquet)
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800', 'Royal themed entrance', 1),
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 'Gold accented main hall', 2),
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800', 'LED stage with decorations', 3);

-- Insert sample reviews for all halls
INSERT INTO public.hall_reviews (hall_id, customer_name, event_type, event_date, rating, review_text, is_approved, is_featured) VALUES
-- Karpaka Raajeshwariy (emerald-garden)
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'Priya & Kannan', 'Wedding', '2024-12-15', 5, 'Our wedding was absolutely magical at Karpaka Raajeshwariy! The staff went above and beyond to make our special day perfect. The hall was beautifully decorated and the natural lighting was stunning for photos.', true, true),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'Selvi Ramanathan', 'Reception', '2024-11-20', 5, 'We hosted our daughter''s reception here and it was wonderful. The modern amenities combined with traditional aesthetics created the perfect atmosphere. Highly recommend!', true, false),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'Kumaran Family', 'Engagement', '2024-10-10', 4, 'Beautiful venue with excellent facilities. The floor-to-ceiling windows provided amazing natural light. Staff was very cooperative and helpful throughout the event.', true, false),
-- Raajeshwariy Tellipalai (sunset-terrace)
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'Meena & Raj', 'Garden Wedding', '2024-11-28', 5, 'The outdoor setting was breathtaking! We had our dream garden wedding under the stars. The string lights created such a romantic atmosphere. Our guests are still talking about how beautiful it was.', true, true),
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'Sivakumar Family', 'Pre-Wedding', '2024-09-15', 5, 'Perfect venue for our mehendi ceremony! The natural backdrop was gorgeous for photos. The pavilion was spacious and well-maintained.', true, false),
-- Raajeshwariy Kondavil (crystal-palace)
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'Lakshmi & Arun', 'Wedding', '2024-10-22', 5, 'An intimate and elegant venue! The crystal decorations and warm wooden accents created such a cozy atmosphere for our wedding. Perfect for our 200-guest celebration.', true, true),
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'Nithya Krishnan', 'Anniversary', '2024-08-14', 4, 'Celebrated our 25th wedding anniversary here. The customizable lighting was wonderful and the garden view added such beauty to our celebration. Great food options too!', true, false),
-- Chelva Mahal (grand-ballroom)
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'Janani & Vikram', 'Wedding', '2024-12-01', 5, 'Chelva Mahal exceeded all our expectations! The grand chandeliers and spacious dance floor made our wedding absolutely unforgettable. The VIP lounge was perfect for our families.', true, true),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'Corporate Solutions Ltd', 'Corporate Event', '2024-11-05', 5, 'Hosted our annual gala dinner here. The hall accommodated 600 guests comfortably. Professional staff, excellent audio-visual systems, and top-notch catering.', true, false),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'Sundaram & Family', 'Reception', '2024-09-28', 4, 'A truly grand venue for grand celebrations! Our son''s wedding reception was spectacular. The private lawn area was perfect for the outdoor portion of our event.', true, false),
-- Chelva Palace (royal-banquet)
('86d57f02-089c-4817-bf33-d403c9093541', 'Revathi & Senthil', 'Wedding', '2024-11-10', 5, 'The royal ambiance of Chelva Palace made us feel like royalty on our wedding day! The gold accents and ornate decorations were breathtaking. Perfect venue for a traditional wedding.', true, true),
('86d57f02-089c-4817-bf33-d403c9093541', 'Murugan Family', 'Engagement', '2024-10-05', 5, 'We had a wonderful engagement ceremony here. The LED stage was perfect for the ring exchange ceremony. The premium sound system ensured all our guests could hear clearly.', true, false);

-- Insert sample event photos for all halls
INSERT INTO public.hall_event_photos (hall_id, image_url, event_type, event_date, caption) VALUES
-- Karpaka Raajeshwariy (emerald-garden)
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'Wedding', '2024-12-15', 'Beautiful Tamil wedding ceremony'),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800', 'Reception', '2024-11-20', 'Elegant reception celebration'),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800', 'Wedding', '2024-10-08', 'Traditional ceremony decorations'),
('b3938423-dfa7-468c-ada1-a8e3791131e0', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'Engagement', '2024-09-22', 'Engagement ceremony setup'),
-- Raajeshwariy Tellipalai (sunset-terrace)
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=800', 'Garden Wedding', '2024-11-28', 'Sunset garden ceremony'),
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', 'Pre-Wedding', '2024-09-15', 'Mehendi celebration'),
('f3001a24-a3f0-46e5-a6b4-7547d80d02e9', 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=800', 'Cocktail Party', '2024-08-20', 'Evening cocktail event'),
-- Raajeshwariy Kondavil (crystal-palace)
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', 'Wedding', '2024-10-22', 'Intimate wedding celebration'),
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'Anniversary', '2024-08-14', 'Silver jubilee celebration'),
('0114eb14-287f-4f18-95d1-15e7e429f3a4', 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', 'Engagement', '2024-07-30', 'Ring ceremony'),
-- Chelva Mahal (grand-ballroom)
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Wedding', '2024-12-01', 'Grand wedding celebration'),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Corporate Event', '2024-11-05', 'Annual corporate gala'),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', 'Reception', '2024-09-28', 'Wedding reception'),
('23bac0a2-9065-4e0a-8de8-8ef73fe4949f', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'Wedding', '2024-08-15', 'Traditional Tamil wedding'),
-- Chelva Palace (royal-banquet)
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 'Wedding', '2024-11-10', 'Royal themed wedding'),
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', 'Engagement', '2024-10-05', 'Engagement ceremony'),
('86d57f02-089c-4817-bf33-d403c9093541', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', 'Birthday Party', '2024-09-12', 'Grand birthday celebration');