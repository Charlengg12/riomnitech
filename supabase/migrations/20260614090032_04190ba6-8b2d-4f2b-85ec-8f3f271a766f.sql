
-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  badge text,
  in_stock boolean NOT NULL DEFAULT true,
  stock_count integer NOT NULL DEFAULT 0,
  sku text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Coupons
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percent', -- percent | fixed
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read coupons" ON public.coupons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_coupons_updated BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Promotions
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cta_label text,
  cta_url text,
  image text,
  active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promotions public read" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Admins manage promotions" ON public.promotions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_promotions_updated BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  user_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending', -- pending|processing|shipped|delivered|cancelled
  total numeric(10,2) NOT NULL DEFAULT 0,
  shipping_address jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated
  USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Order items
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own order items" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR has_role(auth.uid(),'admin'))));
CREATE POLICY "Insert own order items" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Inquiries (contact form / support)
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open', -- open|responded|closed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone create inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users view own inquiries" ON public.inquiries FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage inquiries" ON public.inquiries FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete inquiries" ON public.inquiries FOR DELETE TO authenticated
  USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow admins to read all profiles (for customers page)
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin'));
