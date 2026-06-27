CREATE OR REPLACE FUNCTION get_train_likelihood()
RETURNS TABLE (
  hour_ct INT,
  bucket_15min INT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(HOUR FROM created_at AT TIME ZONE 'America/Chicago')::INT AS hour_ct,
    (FLOOR(EXTRACT(MINUTE FROM created_at AT TIME ZONE 'America/Chicago') / 15) * 15)::INT AS bucket_15min,
    COUNT(*)
  FROM detections
  WHERE label = 'train_close'
    AND created_at > NOW() - INTERVAL '7 days'
  GROUP BY hour_ct, bucket_15min
  ORDER BY hour_ct, bucket_15min;
END;
$$ LANGUAGE plpgsql;