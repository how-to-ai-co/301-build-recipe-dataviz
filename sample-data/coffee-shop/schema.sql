-- Driftwood Coffee (fictional). Times are stored in UTC; the stores are in UTC-7.
create table products (
  product_id text primary key,
  name text not null,
  category text not null,
  price numeric(8,2) not null
);
create table customers (
  customer_id text primary key,
  first_order_at timestamptz not null,
  home_store text not null,
  loyalty_member boolean not null
);
create table orders (
  order_id text primary key,
  ordered_at timestamptz not null,
  store text not null,
  channel text not null,          -- in_store, mobile_app, delivery
  customer_id text references customers(customer_id), -- empty for walk-ins
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null,
  tip numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null            -- completed, refunded
);
create table order_items (
  id bigint generated always as identity primary key,
  order_id text not null references orders(order_id),
  product_id text not null references products(product_id),
  quantity int not null,
  unit_price numeric(8,2) not null
);
create index on orders (ordered_at);
create index on order_items (order_id);
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
