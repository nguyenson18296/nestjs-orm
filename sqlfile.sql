--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Homebrew)
-- Dumped by pg_dump version 14.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.category (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    thumbnail character varying
);


ALTER TABLE public.category OWNER TO admin;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO admin;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: image; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.image (
    id integer NOT NULL,
    url character varying NOT NULL,
    asset_id character varying NOT NULL
);


ALTER TABLE public.image OWNER TO admin;

--
-- Name: image_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_id_seq OWNER TO admin;

--
-- Name: image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.image_id_seq OWNED BY public.image.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.post (
    id integer NOT NULL,
    title character varying NOT NULL,
    content character varying
);


ALTER TABLE public.post OWNER TO admin;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO admin;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    thumbnail character varying,
    description character varying NOT NULL,
    "categoryId" integer,
    price numeric,
    discount_price numeric,
    images character varying[]
);


ALTER TABLE public.product OWNER TO admin;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO admin;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    email_confirm boolean DEFAULT false NOT NULL,
    avatar character varying
);


ALTER TABLE public."user" OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: image id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.image ALTER COLUMN id SET DEFAULT nextval('public.image_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.category (id, title, slug, thumbnail) FROM stdin;
10	Phụ kiện điện thoại	phu-kien-dien-thoai	https://cdn.tgdd.vn//content/icon-phu-kien-96x96-1.png
11	Đồ điện tử	do-dien-tu	https://cdn.tgdd.vn//content/icon-pc-96x96.png
12	Điện thoại	dien-thoai	https://cdn.tgdd.vn//content/icon-phone-96x96-2.png
13	Laptop	laptop	https://cdn.tgdd.vn//content/icon-laptop-96x96-1.png
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.image (id, url, asset_id) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.post (id, title, content) FROM stdin;
1	Handmade Fresh Table	\N
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product (id, title, slug, thumbnail, description, "categoryId", price, discount_price, images) FROM stdin;
12	Laptop Acer Aspire 5 Gaming A515 58GM 51LB i5 13420H/16GB/512GB/4GB RTX2050/Win11 (NX.KQ4SV.002)	laptop-acer-aspire-5-gaming-a515-58gm-51lb-i5	http://res.cloudinary.com/dou7jklnk/image/upload/v1707413012/jvjd6jzqzy2u3cikomcn.jpg	Mẫu laptop gaming với mức giá tầm trung đến từ thương hiệu Acer vừa được lên kệ tại Thế Giới Di Động, sở hữu hiệu năng mạnh mẽ với con chip Intel Gen 13 dòng H hiệu năng cao, RAM 16 GB, card rời RTX cùng nhiều tính năng hiện đại. Laptop Acer Aspire 5 Gaming A515 58GM 51LB i5 13420H (NX.KQ4SV.002) chắc chắn sẽ mang đến cho bạn những trải nghiệm sử dụng và chiến game giải trí tuyệt vời.	11	4000000	3500000	\N
6	Loa Bluetooth Sony SRS-XB100	loa-bluetooth-sony-srs-xb100	http://res.cloudinary.com/dou7jklnk/image/upload/v1706117941/sv0fwn7gqqcc7ol9t1e0.jpg	Loa Bluetooth Sony SRS-XB100 sở hữu thiết kế vô cùng nhỏ gọn, độ bền cao, chất âm ấn tượng cùng thời lượng pin lâu dài,... đáp ứng đa dạng nhu cầu sử dụng của người dùng mọi lúc mọi nơi.	\N	\N	\N	\N
4	Điện thoại iPhone 15 Pro 128GB	dien-thoai-iphone-15-pro-128gb-1	http://res.cloudinary.com/dou7jklnk/image/upload/v1706116551/rdnphtbkvlc8vtvxh3ho.webp	Apple liên tục đem đến các cải tiến hàng năm cho dòng sản phẩm iPhone của mình. iPhone 15 Pro 512GB năm nay đã trải qua một cuộc nâng cấp đáng kể về hiệu năng và thiết kế, sản phẩm hứa hẹn mang lại trải nghiệm hoàn hảo nhất cho người dùng của thế hệ iPhone 15 năm nay.	\N	1200000	1000000	\N
10	Xiaomi Redmi Note 13	xiaomi-redmi-note-13	http://res.cloudinary.com/dou7jklnk/image/upload/v1706192730/zaloazc8m0naaeyk6lfw.png	Xiaomi Redmi Note 13 được cho ra mắt tại Việt Nam, tiếp nối thành công của Redmi Note 12. Máy được kỳ vọng sẽ tiếp tục tạo nên cơn sốt nhờ sở hữu cấu hình tốt trong tầm giá, thiết kế hiện đại, màn hình đẹp và camera 108 MP.	\N	9200000	8500000	\N
11	Đồng hồ thông minh Samsung Galaxy Watch6 40mm	dong-ho-thong-minh-samsung-galaxy-watch6-40mm	http://res.cloudinary.com/dou7jklnk/image/upload/v1707118054/wwobai9vl9jo7xgpd0dq.jpg	Galaxy Unpacked là một trong những sự kiện công nghệ đáng chú ý nhất nửa cuối năm của nhà Samsung. Bên cạnh những mẫu điện thoại gập đình đám, Samsung Galaxy Watch6 40mm cũng là một sản phẩm được mong chờ nhất của các tín đồ công nghệ nói chung và fan nhà Samsung nói riêng.	\N	4200000	3500000	\N
2	Điện thoại iPhone 15 Pro 128GB	\N	http://res.cloudinary.com/dou7jklnk/image/upload/v1706116551/rdnphtbkvlc8vtvxh3ho.webp	Apple liên tục đem đến các cải tiến hàng năm cho dòng sản phẩm iPhone của mình. iPhone 15 Pro 512GB năm nay đã trải qua một cuộc nâng cấp đáng kể về hiệu năng và thiết kế, sản phẩm hứa hẹn mang lại trải nghiệm hoàn hảo nhất cho người dùng của thế hệ iPhone 15 năm nay.	\N	18200000	\N	\N
13	Adapter Sạc USB 12W AVA+ CS-TC021	adapter-sac-usb-12w-ava-cs-tc2021	http://res.cloudinary.com/dou7jklnk/image/upload/v1707413089/laafh59dqqcghj1bwudq.jpg	Adapter Sạc USB 12W AVA+ CS-TC021 Trắng sở hữu thiết kế gọn gàng, đẹp mắt, sử dụng cùng cáp sạc để cung cấp nguồn điện cho các thiết bị điện tử của bạn.	11	5000000	4000000	\N
14	Đồng hồ thông minh Garmin Forerunner 55 42mm	ng-h-thng-minh-garmin-forerunner-55-42mm	http://res.cloudinary.com/dou7jklnk/image/upload/v1707568596/cjcnwmzstoftvygyiu4r.jpg	Đồng hồ thông minh Garmin Forerunner 55 có thiết kế năng động, thể thao dành riêng cho chạy bộ nhưng vẫn không kém phần thời trang, sành điệu với mặt kính tròn và dây đeo silicone mềm mại, êm ái, tạo cảm giác thoải mái khi tập thể thao trong thời gian dài. \n\n- Nếu lần đầu trải nghiệm, bạn sẽ gặp chút khó khăn do màn hình đồng hồ không phải loại cảm ứng, thay vào đó là 5 phím cơ để điều khiển với 2 nút Start, Back-lap bên phải và 3 nút Light, up-menu, down bên trái.	13	\N	\N	\N
7	Máy tính bảng Samsung Galaxy Tab A9+ 5G	may-tinh-bang-samsung-galaxy-tab-a9-5G	http://res.cloudinary.com/dou7jklnk/image/upload/v1706162792/ohsvdxy5d61oigr6yn86.jpg	Với giá cả phải chăng, Samsung Galaxy Tab A9+ 5G là một sản phẩm máy tính bảng của Samsung dành cho người dùng muốn sở hữu một thiết bị giải trí cơ bản với màn hình rộng và khả năng kết nối mạng toàn diện để truy cập internet bất kỳ lúc nào và ở bất kỳ đâu.	\N	2000000	1500000	\N
3	Điện thoại iPhone 15 Pro 128GB	dien-thoai-iphone-15-pro-128gb	http://res.cloudinary.com/dou7jklnk/image/upload/v1706117726/trijds2kzop4sxwdrfeq.jpg	Apple liên tục đem đến các cải tiến hàng năm cho dòng sản phẩm iPhone của mình. iPhone 15 Pro 512GB năm nay đã trải qua một cuộc nâng cấp đáng kể về hiệu năng và thiết kế, sản phẩm hứa hẹn mang lại trải nghiệm hoàn hảo nhất cho người dùng của thế hệ iPhone 15 năm nay.	\N	18200000	\N	\N
5	Loa Bluetooth Rezo Light Motion K118	loa-bluetooth-rezo-light-motion-k118	http://res.cloudinary.com/dou7jklnk/image/upload/v1706117726/trijds2kzop4sxwdrfeq.jpg	Loa Bluetooth Rezo Light Motion K118 sở hữu thiết kế sang trọng, nổi bật với đèn LED đa sắc, âm thanh 360 độ chân thực và sống động, thời lượng pin lớn, mang đến cho bạn những buổi tiệc âm nhạc hoàn hảo.	\N	8200000	4500000	\N
8	Máy tính bảng Samsung Galaxy Tab A9+ 5G	may-tinh-bang-samsung-galaxy-tab-a9-5G-1	http://res.cloudinary.com/dou7jklnk/image/upload/v1706189619/z4xouqbx2rmygkiiqbnx.jpg	Với giá cả phải chăng, Samsung Galaxy Tab A9+ 5G là một sản phẩm máy tính bảng của Samsung dành cho người dùng muốn sở hữu một thiết bị giải trí cơ bản với màn hình rộng và khả năng kết nối mạng toàn diện để truy cập internet bất kỳ lúc nào và ở bất kỳ đâu.	\N	5200000	4500000	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, username, email, password, email_confirm, avatar) FROM stdin;
1	fjnova	fjnova1996@gmail.com	123456	f	\N
2	sonnguyen	sonnguyen1996@gmail.com	$2b$10$55JDaf5YhJDjZvPcV7wRCuYbSrhZiNe5dB6IG5POCZC9806/dZq06	f	\N
\.


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.category_id_seq', 13, true);


--
-- Name: image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.image_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.post_id_seq', 1, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_id_seq', 14, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 2, true);


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: post PK_be5fda3aac270b134ff9c21cdee; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: image PK_d6db1ab4ee9ad9dbe86c64e4cc3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY (id);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: product UQ_8cfaf4a1e80806d58e3dbe69224; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE (slug);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: product FK_ff0c0301a95e517153df97f6812; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES public.category(id);


--
-- PostgreSQL database dump complete
--

