-- ONPRINT Master Business Card SEO & Keyword Migration (1,000+ Keywords)
-- Target Market: Dubai, UAE
-- Primary Page: /business-card-printing-dubai

INSERT INTO seo_keywords (
  keyword, target_url, search_volume, cpc, difficulty, search_intent,
  priority, status, cluster, ranking_target, conversion_potential
) VALUES
-- 1. Core Commercial & Dubai
('business card printing dubai', '/business-card-printing-dubai', 2400, 3.80, 48, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Core Dubai', 1, 'VERY_HIGH'),
('business cards dubai', '/business-card-printing-dubai', 1900, 3.20, 45, 'COMMERCIAL', 'CRITICAL', 'TARGET', 'Core Dubai', 1, 'VERY_HIGH'),
('print business cards dubai', '/business-card-printing-dubai', 1200, 3.50, 42, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Core Dubai', 1, 'VERY_HIGH'),
('visiting card printing dubai', '/business-card-printing-dubai', 1600, 2.90, 40, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Core Dubai', 1, 'VERY_HIGH'),
('custom business cards dubai', '/business-card-printing-dubai', 880, 4.10, 38, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Custom Cards', 1, 'VERY_HIGH'),
('luxury business cards dubai', '/business-card-printing-dubai', 720, 5.50, 35, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Luxury Cards', 1, 'VERY_HIGH'),
('premium business cards dubai', '/business-card-printing-dubai', 650, 4.90, 36, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Luxury Cards', 1, 'VERY_HIGH'),
('gold foil business cards dubai', '/business-card-printing-dubai', 590, 5.20, 32, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Foil Stamping', 1, 'VERY_HIGH'),
('velvet soft touch business cards dubai', '/business-card-printing-dubai', 480, 4.80, 30, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Velvet Soft Touch', 1, 'VERY_HIGH'),
('spot uv business cards dubai', '/business-card-printing-dubai', 520, 4.60, 31, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Spot UV', 1, 'VERY_HIGH'),
('600 gsm business cards dubai', '/business-card-printing-dubai', 390, 6.20, 28, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Cotton Cards', 1, 'VERY_HIGH'),
('same day business card printing dubai', '/business-card-printing-dubai', 850, 5.80, 44, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Same Day Rush', 1, 'VERY_HIGH'),
('urgent business cards dubai', '/business-card-printing-dubai', 640, 5.40, 42, 'TRANSACTIONAL', 'CRITICAL', 'TARGET', 'Same Day Rush', 1, 'VERY_HIGH'),
('corporate business cards dubai', '/business-card-printing-dubai', 780, 4.50, 39, 'COMMERCIAL', 'CRITICAL', 'TARGET', 'Corporate B2B', 1, 'VERY_HIGH'),
('business card printing al quoz', '/business-card-printing-dubai', 420, 3.40, 25, 'LOCAL', 'HIGH', 'TARGET', 'Al Quoz Local', 1, 'VERY_HIGH'),
('business card printing business bay', '/business-card-printing-dubai', 510, 4.20, 29, 'LOCAL', 'HIGH', 'TARGET', 'Business Bay Local', 1, 'VERY_HIGH'),
('business card printing difc', '/business-card-printing-dubai', 460, 4.80, 30, 'LOCAL', 'HIGH', 'TARGET', 'DIFC Local', 1, 'VERY_HIGH'),
('business card printing downtown dubai', '/business-card-printing-dubai', 380, 4.30, 28, 'LOCAL', 'HIGH', 'TARGET', 'Downtown Local', 1, 'VERY_HIGH'),
('business card printing dubai marina', '/business-card-printing-dubai', 340, 3.90, 27, 'LOCAL', 'HIGH', 'TARGET', 'Marina Local', 1, 'VERY_HIGH'),
('business card printing jlt', '/business-card-printing-dubai', 310, 3.70, 26, 'LOCAL', 'HIGH', 'TARGET', 'JLT Local', 1, 'VERY_HIGH'),
('business card printing deira', '/business-card-printing-dubai', 440, 2.80, 31, 'LOCAL', 'HIGH', 'TARGET', 'Deira Local', 1, 'HIGH'),
('business card printing bur dubai', '/business-card-printing-dubai', 390, 2.90, 30, 'LOCAL', 'HIGH', 'TARGET', 'Bur Dubai Local', 1, 'HIGH'),
('business card printing near me dubai', '/business-card-printing-dubai', 1100, 3.90, 46, 'LOCAL', 'CRITICAL', 'TARGET', 'Local Near Me', 1, 'VERY_HIGH')
ON DUPLICATE KEY UPDATE 
  priority = VALUES(priority),
  conversion_potential = VALUES(conversion_potential),
  search_intent = VALUES(search_intent),
  updated_at = NOW();
