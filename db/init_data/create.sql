
DROP TABLE IF EXISTS inventory_item cascade;
CREATE TABLE inventory_item
(
    product_id integer NOT NULL,
    discount double precision,
    price double precision NOT NULL,
    quantity integer NOT NULL,
    sold integer,
    available integer,
    created_at timestamp without time zone,
    update_at timestamp without time zone,
    PRIMARY KEY (product_id)
);

DROP TABLE IF EXISTS order_items cascade;
CREATE TABLE order_items
(
    order_id integer UNIQUE NOT NULL,
    product_id integer NOT NULL,
    quantity integer,
    PRIMARY KEY (order_id, product_id)
);

DROP TABLE IF EXISTS orders cascade;
CREATE TABLE orders
(
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    img_src_nails VARCHAR (200),
    img_src_sheet VARCHAR (200),
    created_at timestamp with time zone,
    PRIMARY KEY (order_id)
);

DROP TABLE IF EXISTS product cascade;
CREATE TABLE product
(
  product_id integer UNIQUE NOT NULL primary key,
  product_name varchar(255),
  price float,
  img_src_nails VARCHAR(200), 
  img_src_sheet VARCHAR(200),
  created_at TIMESTAMP DEFAULT (now()),
  product_description TEXT 
);

DROP TABLE IF EXISTS review cascade;
CREATE TABLE review
(
    review_id integer NOT NULL,
    product_id integer NOT NULL,
    rating integer,
    review text,
    review_date date,
    PRIMARY KEY (review_id)
);


DROP TABLE IF EXISTS users cascade;
CREATE TABLE users
(
    user_id SERIAL,
    user_firstname character varying(255) NOT NULL,
    user_lastname character varying(255) NOT NULL,
    user_email character varying(255),
    mobile text,
    register_date date,
    address text,
    favourite_item integer,
    cart integer,
    PASSWORD TEXT,  
    PRIMARY KEY (user_id)
);

ALTER TABLE users
    ADD FOREIGN KEY (favourite_item)
    REFERENCES product (product_id)
    NOT VALID;


ALTER TABLE users
    ADD FOREIGN KEY (cart)
    REFERENCES product (product_id)
    NOT VALID;


ALTER TABLE inventory_item
    ADD FOREIGN KEY (product_id)
    REFERENCES product (product_id)
    NOT VALID;


ALTER TABLE review
    ADD FOREIGN KEY (product_id)
    REFERENCES product (product_id)
    NOT VALID;


ALTER TABLE orders
    ADD FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    NOT VALID;


ALTER TABLE orders
    ADD FOREIGN KEY (order_id)
    REFERENCES order_items (order_id)
    NOT VALID;


INSERT INTO product VALUES (1, 'Four Leaf Clover', 5.00, '..\resources\Photos\Nail Art Photos\Four_Leaf_Clover.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Four Leaf Clover Macros.jpg');
INSERT INTO product VALUES (2, 'Falling Stars', 5.00, '..\resources\Photos\Nail Art Photos\FallingStars.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Dreamcatcher Macros.jpg');
INSERT INTO product VALUES (3, 'Math Symbols', 5.00, '..\resources\Photos\Nail Art Photos\Math.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Math Symbols Macros.jpg');
INSERT INTO product VALUES (4, 'Angel Wings', 5.00, '..\resources\Photos\Nail Art Photos\Angel_Wing_Nail.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Angel Wings Macro.jpg');
INSERT INTO product VALUES (5, 'Music Notes', 5.00, '..\resources\Photos\Nail Art Photos\Music Notes.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Music Notes.jpg');
INSERT INTO product VALUES (6, 'Awareness Ribbon', 5.00, '..\resources\Photos\Nail Art Photos\Awareness Ribbon.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Awareness Ribbon Macros.jpg');
INSERT INTO product VALUES (7, 'Stripes', 5.00, '..\resources\Photos\Nail Art Photos\Stripes.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Line Nail Vinyls.jpg');
INSERT INTO product VALUES (8, 'Gender Symbols', 5.00, '..\resources\Photos\Nail Art Photos\gender.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Gender Symbols Marcros.jpg');
INSERT INTO product VALUES (9, 'Small Pride Flag', 5.00, '..\resources\Photos\Nail Art Photos\Pride.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Pride Flag Small Macros.jpg');
INSERT INTO product VALUES (10, 'Large Pride Flag', 5.00, '..\resources\Photos\Nail Art Photos\Pride.jpg', '..\resources\Photos\Nail Vinyl Sheet Photos\Pride Flag Large Macro.jpg');
