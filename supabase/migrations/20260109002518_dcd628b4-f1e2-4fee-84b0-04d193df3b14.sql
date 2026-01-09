-- Fix function search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop overly permissive policies and replace with more secure ones
DROP POLICY IF EXISTS "Anyone can submit service requests" ON public.service_requests;

-- Replace with user-id tracked policy (null for anonymous, id for logged in)
CREATE POLICY "Anyone can submit service requests"
ON public.service_requests FOR INSERT
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
    ELSE user_id IS NULL
  END
);