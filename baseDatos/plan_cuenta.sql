PGDMP                      }            plan_cuenta    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    160622    plan_cuenta    DATABASE     �   CREATE DATABASE plan_cuenta WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
    DROP DATABASE plan_cuenta;
                postgres    false            �            1259    168829    cuenta    TABLE     �  CREATE TABLE public.cuenta (
    cuenta_id integer NOT NULL,
    cuenta_idpadre integer,
    cuenta_grupo character varying(100),
    cuenta_codigopadre character varying(100),
    cuenta_padredescripcion character varying(500),
    cuenta_codigonivel character varying(100),
    cuenta_descripcion character varying(500),
    cuenta_esdebito boolean,
    cuenta_children boolean DEFAULT false
);
    DROP TABLE public.cuenta;
       public         heap    postgres    false            �            1259    168828    cuenta_cuenta_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cuenta_cuenta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.cuenta_cuenta_id_seq;
       public          postgres    false    216            �           0    0    cuenta_cuenta_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.cuenta_cuenta_id_seq OWNED BY public.cuenta.cuenta_id;
          public          postgres    false    215                       2604    168832    cuenta cuenta_id    DEFAULT     t   ALTER TABLE ONLY public.cuenta ALTER COLUMN cuenta_id SET DEFAULT nextval('public.cuenta_cuenta_id_seq'::regclass);
 ?   ALTER TABLE public.cuenta ALTER COLUMN cuenta_id DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    168829    cuenta 
   TABLE DATA           �   COPY public.cuenta (cuenta_id, cuenta_idpadre, cuenta_grupo, cuenta_codigopadre, cuenta_padredescripcion, cuenta_codigonivel, cuenta_descripcion, cuenta_esdebito, cuenta_children) FROM stdin;
    public          postgres    false    216          �           0    0    cuenta_cuenta_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.cuenta_cuenta_id_seq', 344, true);
          public          postgres    false    215                       2606    168836    cuenta cuenta_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (cuenta_id);
 <   ALTER TABLE ONLY public.cuenta DROP CONSTRAINT cuenta_pkey;
       public            postgres    false    216                       2606    168837 !   cuenta cuenta_cuenta_idpadre_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_cuenta_idpadre_fkey FOREIGN KEY (cuenta_idpadre) REFERENCES public.cuenta(cuenta_id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.cuenta DROP CONSTRAINT cuenta_cuenta_idpadre_fkey;
       public          postgres    false    216    4637    216            �   #  x����J�0��ӧ�,M�v�b5�Iwaa/"
=hA�/�#�bf���fA!�a��~f� ����	1��qPVsH�!�X��$xx*�P��M��������Z(i�H�%0�����<��я~���5Z�������ն�E(�L�(gp�$���Q|Q��7��tU�9�`����g�\��`�9��NX����uD\!1X�a`�~ퟱ-Z\`�qn!���#qrfc���ssZ�j}��J�dT�:n6�4y2�ϯEA�d���۫����R2q�iS�ⅼ+     