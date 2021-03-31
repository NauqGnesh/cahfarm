--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2 (Debian 13.2-1.pgdg100+1)

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

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

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: black_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.black_cards (
    id integer NOT NULL,
    draw integer NOT NULL,
    pick integer NOT NULL,
    text character varying(255),
    watermark character varying(255)
);


ALTER TABLE public.black_cards OWNER TO postgres;

--
-- Name: card_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_set (
    id integer NOT NULL,
    active boolean NOT NULL,
    base_deck boolean NOT NULL,
    description character varying(255),
    name character varying(255),
    weight integer NOT NULL
);


ALTER TABLE public.card_set OWNER TO postgres;

--
-- Name: card_set_black_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_set_black_card (
    card_set_id integer NOT NULL,
    black_card_id integer NOT NULL
);


ALTER TABLE public.card_set_black_card OWNER TO postgres;

--
-- Name: card_set_white_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_set_white_card (
    card_set_id integer NOT NULL,
    white_card_id integer NOT NULL
);


ALTER TABLE public.card_set_white_card OWNER TO postgres;

--
-- Name: hibernate_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hibernate_sequence OWNER TO postgres;

--
-- Name: play_one_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.play_one_card (
    black_card integer,
    white_card integer,
    played integer,
    win integer
);


ALTER TABLE public.play_one_card OWNER TO postgres;

--
-- Name: play_three_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.play_three_card (
    black_card integer,
    white_card1 integer,
    white_card2 integer,
    white_card3 integer,
    played integer,
    win integer
);


ALTER TABLE public.play_three_card OWNER TO postgres;

--
-- Name: play_two_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.play_two_card (
    black_card integer,
    white_card1 integer,
    white_card2 integer,
    played integer,
    win integer
);


ALTER TABLE public.play_two_card OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: white_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.white_cards (
    id integer NOT NULL,
    text character varying(255),
    watermark character varying(255)
);


ALTER TABLE public.white_cards OWNER TO postgres;

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: black_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.black_cards (id, draw, pick, text, watermark) FROM stdin;
\.
COPY public.black_cards (id, draw, pick, text, watermark) FROM '$$PATH$$/3002.dat';

--
-- Data for Name: card_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_set (id, active, base_deck, description, name, weight) FROM stdin;
\.
COPY public.card_set (id, active, base_deck, description, name, weight) FROM '$$PATH$$/3003.dat';

--
-- Data for Name: card_set_black_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_set_black_card (card_set_id, black_card_id) FROM stdin;
\.
COPY public.card_set_black_card (card_set_id, black_card_id) FROM '$$PATH$$/3004.dat';

--
-- Data for Name: card_set_white_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_set_white_card (card_set_id, white_card_id) FROM stdin;
\.
COPY public.card_set_white_card (card_set_id, white_card_id) FROM '$$PATH$$/3005.dat';

--
-- Data for Name: play_one_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.play_one_card (black_card, white_card, played, win) FROM stdin;
\.
COPY public.play_one_card (black_card, white_card, played, win) FROM '$$PATH$$/3007.dat';

--
-- Data for Name: play_three_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.play_three_card (black_card, white_card1, white_card2, white_card3, played, win) FROM stdin;
\.
COPY public.play_three_card (black_card, white_card1, white_card2, white_card3, played, win) FROM '$$PATH$$/3009.dat';

--
-- Data for Name: play_two_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.play_two_card (black_card, white_card1, white_card2, played, win) FROM stdin;
\.
COPY public.play_two_card (black_card, white_card1, white_card2, played, win) FROM '$$PATH$$/3008.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
\.
COPY public.users (id, email, password) FROM '$$PATH$$/3011.dat';

--
-- Data for Name: white_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.white_cards (id, text, watermark) FROM stdin;
\.
COPY public.white_cards (id, text, watermark) FROM '$$PATH$$/3006.dat';

--
-- Name: hibernate_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hibernate_sequence', 2622, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: black_cards black_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.black_cards
    ADD CONSTRAINT black_cards_pkey PRIMARY KEY (id);


--
-- Name: card_set_black_card card_set_black_card_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_black_card
    ADD CONSTRAINT card_set_black_card_pkey PRIMARY KEY (card_set_id, black_card_id);


--
-- Name: card_set card_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set
    ADD CONSTRAINT card_set_pkey PRIMARY KEY (id);


--
-- Name: card_set_white_card card_set_white_card_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_white_card
    ADD CONSTRAINT card_set_white_card_pkey PRIMARY KEY (card_set_id, white_card_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: white_cards white_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.white_cards
    ADD CONSTRAINT white_cards_pkey PRIMARY KEY (id);


--
-- Name: pair_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pair_id ON public.play_one_card USING btree (black_card, white_card);


--
-- Name: quad_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX quad_id ON public.play_three_card USING btree (black_card, white_card1, white_card2, white_card3);


--
-- Name: triplet_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX triplet_id ON public.play_two_card USING btree (black_card, white_card1, white_card2);


--
-- Name: card_set_black_card fk513da45c3166b76a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_black_card
    ADD CONSTRAINT fk513da45c3166b76a FOREIGN KEY (black_card_id) REFERENCES public.black_cards(id);


--
-- Name: card_set_black_card fk513da45c985dacea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_black_card
    ADD CONSTRAINT fk513da45c985dacea FOREIGN KEY (card_set_id) REFERENCES public.card_set(id);


--
-- Name: card_set_white_card fkc248727257c340be; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_white_card
    ADD CONSTRAINT fkc248727257c340be FOREIGN KEY (white_card_id) REFERENCES public.white_cards(id);


--
-- Name: card_set_white_card fkc2487272985dacea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_set_white_card
    ADD CONSTRAINT fkc2487272985dacea FOREIGN KEY (card_set_id) REFERENCES public.card_set(id);


--
-- Name: play_one_card play_one_card_black_card_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_one_card
    ADD CONSTRAINT play_one_card_black_card_fkey FOREIGN KEY (black_card) REFERENCES public.black_cards(id);


--
-- Name: play_one_card play_one_card_white_card_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_one_card
    ADD CONSTRAINT play_one_card_white_card_fkey FOREIGN KEY (white_card) REFERENCES public.white_cards(id);


--
-- Name: play_three_card play_three_card_black_card_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_three_card
    ADD CONSTRAINT play_three_card_black_card_fkey FOREIGN KEY (black_card) REFERENCES public.black_cards(id);


--
-- Name: play_three_card play_three_card_white_card1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_three_card
    ADD CONSTRAINT play_three_card_white_card1_fkey FOREIGN KEY (white_card1) REFERENCES public.white_cards(id);


--
-- Name: play_three_card play_three_card_white_card2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_three_card
    ADD CONSTRAINT play_three_card_white_card2_fkey FOREIGN KEY (white_card2) REFERENCES public.white_cards(id);


--
-- Name: play_three_card play_three_card_white_card3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_three_card
    ADD CONSTRAINT play_three_card_white_card3_fkey FOREIGN KEY (white_card3) REFERENCES public.white_cards(id);


--
-- Name: play_two_card play_two_card_black_card_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_two_card
    ADD CONSTRAINT play_two_card_black_card_fkey FOREIGN KEY (black_card) REFERENCES public.black_cards(id);


--
-- Name: play_two_card play_two_card_white_card1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_two_card
    ADD CONSTRAINT play_two_card_white_card1_fkey FOREIGN KEY (white_card1) REFERENCES public.white_cards(id);


--
-- Name: play_two_card play_two_card_white_card2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.play_two_card
    ADD CONSTRAINT play_two_card_white_card2_fkey FOREIGN KEY (white_card2) REFERENCES public.white_cards(id);


--
-- PostgreSQL database dump complete
--

