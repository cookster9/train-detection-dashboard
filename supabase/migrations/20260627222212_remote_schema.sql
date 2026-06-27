drop extension if exists "pg_net";


  create table "public"."detections" (
    "id" uuid not null default gen_random_uuid(),
    "timestamp" text not null,
    "label" text not null,
    "score" double precision not null,
    "sample_rate" integer not null,
    "audio_clip_path" text,
    "device_id" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."detections" enable row level security;

CREATE INDEX detections_created_at_idx ON public.detections USING btree (created_at DESC);

CREATE INDEX detections_label_idx ON public.detections USING btree (label);

CREATE UNIQUE INDEX detections_pkey ON public.detections USING btree (id);

CREATE INDEX detections_timestamp_idx ON public.detections USING btree ("timestamp" DESC);

alter table "public"."detections" add constraint "detections_pkey" PRIMARY KEY using index "detections_pkey";

grant delete on table "public"."detections" to "anon";

grant insert on table "public"."detections" to "anon";

grant references on table "public"."detections" to "anon";

grant select on table "public"."detections" to "anon";

grant trigger on table "public"."detections" to "anon";

grant truncate on table "public"."detections" to "anon";

grant update on table "public"."detections" to "anon";

grant delete on table "public"."detections" to "authenticated";

grant insert on table "public"."detections" to "authenticated";

grant references on table "public"."detections" to "authenticated";

grant select on table "public"."detections" to "authenticated";

grant trigger on table "public"."detections" to "authenticated";

grant truncate on table "public"."detections" to "authenticated";

grant update on table "public"."detections" to "authenticated";

grant delete on table "public"."detections" to "service_role";

grant insert on table "public"."detections" to "service_role";

grant references on table "public"."detections" to "service_role";

grant select on table "public"."detections" to "service_role";

grant trigger on table "public"."detections" to "service_role";

grant truncate on table "public"."detections" to "service_role";

grant update on table "public"."detections" to "service_role";


  create policy "web read"
  on "public"."detections"
  as permissive
  for select
  to public
using (true);



