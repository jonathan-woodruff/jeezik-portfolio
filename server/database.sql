--create users table
CREATE TABLE users (
  user_id serial PRIMARY KEY,
  email varchar(255) unique not null,
  password varchar(255),
  created_at date default current_date
);