PGDMP  $        	            }            plan_cuenta    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    160622    plan_cuenta    DATABASE     �   CREATE DATABASE plan_cuenta WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
    DROP DATABASE plan_cuenta;
                postgres    false            �            1259    160624    cuenta    TABLE     @  CREATE TABLE public.cuenta (
    cuenta_id integer NOT NULL,
    cuenta_id_padre integer,
    cuenta_grupo character varying(100),
    cuenta_codigopadre character varying(100),
    cuenta_codigonivel character varying(100),
    cuenta_descripcion character varying(500),
    cuenta_naturaleza character varying(100)
);
    DROP TABLE public.cuenta;
       public         heap    postgres    false            �            1259    160623    cuenta_cuenta_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cuenta_cuenta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.cuenta_cuenta_id_seq;
       public          postgres    false    216            �           0    0    cuenta_cuenta_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.cuenta_cuenta_id_seq OWNED BY public.cuenta.cuenta_id;
          public          postgres    false    215                       2604    160627    cuenta cuenta_id    DEFAULT     t   ALTER TABLE ONLY public.cuenta ALTER COLUMN cuenta_id SET DEFAULT nextval('public.cuenta_cuenta_id_seq'::regclass);
 ?   ALTER TABLE public.cuenta ALTER COLUMN cuenta_id DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    160624    cuenta 
   TABLE DATA           �   COPY public.cuenta (cuenta_id, cuenta_id_padre, cuenta_grupo, cuenta_codigopadre, cuenta_codigonivel, cuenta_descripcion, cuenta_naturaleza) FROM stdin;
    public          postgres    false    216          �           0    0    cuenta_cuenta_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.cuenta_cuenta_id_seq', 1, false);
          public          postgres    false    215                       2606    160631    cuenta cuenta_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (cuenta_id);
 <   ALTER TABLE ONLY public.cuenta DROP CONSTRAINT cuenta_pkey;
       public            postgres    false    216                       2606    160632 "   cuenta cuenta_cuenta_id_padre_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_cuenta_id_padre_fkey FOREIGN KEY (cuenta_id_padre) REFERENCES public.cuenta(cuenta_id);
 L   ALTER TABLE ONLY public.cuenta DROP CONSTRAINT cuenta_cuenta_id_padre_fkey;
       public          postgres    false    216    216    4636            �      x������ � �     