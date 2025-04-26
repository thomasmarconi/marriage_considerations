CREATE SCHEMA IF NOT EXISTS "public";

CREATE SEQUENCE "public".business_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".character_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".children_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".considerations_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".faith_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".family_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".friendship_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".physical_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".roommate_assessments_id_seq AS integer START WITH 1 INCREMENT BY 1;

CREATE  TABLE "public".users ( 
	id                   uuid  NOT NULL  ,
	email                text  NOT NULL  ,
	image                text    ,
	name                 text  NOT NULL  ,
	CONSTRAINT users_pkey PRIMARY KEY ( id ),
	CONSTRAINT unique_email UNIQUE ( email ) 
 );

CREATE  TABLE "public".considerations ( 
	id                   serial  NOT NULL  ,
	name                 varchar(100)  NOT NULL  ,
	age                  integer    ,
	date_met             date    ,
	created_at           timestamptz DEFAULT now()   ,
	updated_at           timestamptz DEFAULT now()   ,
	overall_notes        text    ,
	author_email         text  NOT NULL  ,
	CONSTRAINT considerations_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".faith_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	is_catholic          boolean DEFAULT false   ,
	practices_faith      integer    ,
	shared_moral_values  integer    ,
	helps_get_to_heaven  integer    ,
	notes                text    ,
	CONSTRAINT faith_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".faith_assessments ADD CONSTRAINT faith_assessments_helps_get_to_heaven_check CHECK ( helps_get_to_heaven >= 1) AND (helps_get_to_heaven <= 5 );

ALTER TABLE "public".faith_assessments ADD CONSTRAINT faith_assessments_practices_faith_check CHECK ( practices_faith >= 1) AND (practices_faith <= 5 );

ALTER TABLE "public".faith_assessments ADD CONSTRAINT faith_assessments_shared_moral_values_check CHECK ( shared_moral_values >= 1) AND (shared_moral_values <= 5 );

CREATE  TABLE "public".family_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	solid_family_background integer    ,
	parents_marital_status varchar(50)    ,
	family_values        integer    ,
	family_functioning   integer    ,
	sibling_relationships integer    ,
	enjoy_family         integer    ,
	friend_group         integer    ,
	gets_along_with_your_family integer    ,
	gets_along_with_your_friends integer    ,
	possessive           integer    ,
	notes                text    ,
	CONSTRAINT family_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_family_functioning_check CHECK ( family_functioning >= 1) AND (family_functioning <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_family_values_check CHECK ( family_values >= 1) AND (family_values <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_friend_group_check CHECK ( friend_group >= 1) AND (friend_group <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_gets_along_with_your_family_check CHECK ( gets_along_with_your_family >= 1) AND (gets_along_with_your_family <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_gets_along_with_your_friends_check CHECK ( gets_along_with_your_friends >= 1) AND (gets_along_with_your_friends <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_possessive_check CHECK ( possessive >= 1) AND (possessive <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_sibling_relationships_check CHECK ( sibling_relationships >= 1) AND (sibling_relationships <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_enjoy_family_check CHECK ( enjoy_family >= 1) AND (enjoy_family <= 5 );

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_solid_family_background_check CHECK ( solid_family_background >= 1) AND (solid_family_background <= 5 );

CREATE  TABLE "public".friendship_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	fun                  integer    ,
	shared_interests     integer    ,
	adventurous          integer    ,
	outdoorsy            integer    ,
	curious              integer    ,
	creative             integer    ,
	conversation         integer    ,
	communication        integer    ,
	conflict_resolution  integer    ,
	unselfish            integer    ,
	enjoyable_company    integer    ,
	notes                text    ,
	CONSTRAINT friendship_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_communication_check CHECK ( communication >= 1) AND (communication <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_conflict_resolution_check CHECK ( conflict_resolution >= 1) AND (conflict_resolution <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_conversation_check CHECK ( conversation >= 1) AND (conversation <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_creative_check CHECK ( creative >= 1) AND (creative <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_curious_check CHECK ( curious >= 1) AND (curious <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_enjoyable_company_check CHECK ( enjoyable_company >= 1) AND (enjoyable_company <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_fun_check CHECK ( fun >= 1) AND (fun <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_outdoorsy_check CHECK ( outdoorsy >= 1) AND (outdoorsy <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_shared_interests_check CHECK ( shared_interests >= 1) AND (shared_interests <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_adventurous_check CHECK ( adventurous >= 1) AND (adventurous <= 5 );

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_unselfish_check CHECK ( unselfish >= 1) AND (unselfish <= 5 );

CREATE  TABLE "public".physical_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	attraction           integer    ,
	fitness              integer    ,
	health_conscious     integer    ,
	hygiene              integer    ,
	family_longevity     integer    ,
	notes                text    ,
	CONSTRAINT physical_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_attraction_check CHECK ( attraction >= 1) AND (attraction <= 5 );

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_family_longevity_check CHECK ( family_longevity >= 1) AND (family_longevity <= 5 );

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_fitness_check CHECK ( fitness >= 1) AND (fitness <= 5 );

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_health_conscious_check CHECK ( health_conscious >= 1) AND (health_conscious <= 5 );

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_hygiene_check CHECK ( hygiene >= 1) AND (hygiene <= 5 );

CREATE  TABLE "public".roommate_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	tidiness             integer    ,
	dishes               integer    ,
	personal_space       integer    ,
	housekeeping         integer    ,
	shares_burden        integer    ,
	notes                text    ,
	CONSTRAINT roommate_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_dishes_check CHECK ( dishes >= 1) AND (dishes <= 5 );

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_housekeeping_check CHECK ( housekeeping >= 1) AND (housekeeping <= 5 );

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_personal_space_check CHECK ( personal_space >= 1) AND (personal_space <= 5 );

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_shares_burden_check CHECK ( shares_burden >= 1) AND (shares_burden <= 5 );

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_tidiness_check CHECK ( tidiness >= 1) AND (tidiness <= 5 );

CREATE  TABLE "public".business_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	saver                integer    ,
	wasteful             integer    ,
	maintenance          integer    ,
	willing_to_sacrifice integer    ,
	risk_taker           integer    ,
	debt                 text    ,
	financial_responsibility integer    ,
	self_starter         integer    ,
	notes                text    ,
	CONSTRAINT business_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_wasteful_check CHECK ( wasteful >= 1) AND (wasteful <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_maintenance_check CHECK ( maintenance >= 1) AND (maintenance <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_willing_to_sacrifice_check CHECK ( willing_to_sacrifice >= 1) AND (willing_to_sacrifice <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_saver_check CHECK ( saver >= 1) AND (saver <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_financial_responsibility_check CHECK ( financial_responsibility >= 1) AND (financial_responsibility <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_self_starter_check CHECK ( self_starter >= 1) AND (self_starter <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_risk_taker_check CHECK ( risk_taker >= 1) AND (risk_taker <= 5 );

CREATE  TABLE "public".character_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	friendly             integer    ,
	happy                integer    ,
	polite               integer    ,
	proud                integer    ,
	discretion           integer    ,
	charitable           integer    ,
	humble               integer    ,
	kind                 integer    ,
	positive_attitude    integer    ,
	courageous           integer    ,
	self_effacing        integer    ,
	traditional_values   integer    ,
	political_alignment  integer    ,
	dating_history       text    ,
	notes                text    ,
	CONSTRAINT character_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_happy_check CHECK ( happy >= 1) AND (happy <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_polite_check CHECK ( polite >= 1) AND (polite <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_proud_check CHECK ( proud >= 1) AND (proud <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_discretion_check CHECK ( discretion >= 1) AND (discretion <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_charitable_check CHECK ( charitable >= 1) AND (charitable <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_humble_check CHECK ( humble >= 1) AND (humble <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_friendly_check CHECK ( friendly >= 1) AND (friendly <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_positive_attitude_check CHECK ( positive_attitude >= 1) AND (positive_attitude <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_courageous_check CHECK ( courageous >= 1) AND (courageous <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_self_effacing_check CHECK ( self_effacing >= 1) AND (self_effacing <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_traditional_values_check CHECK ( traditional_values >= 1) AND (traditional_values <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_political_alignment_check CHECK ( political_alignment >= 1) AND (political_alignment <= 5 );

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_kind_check CHECK ( kind >= 1) AND (kind <= 5 );

CREATE  TABLE "public".children_assessments ( 
	id                   serial  NOT NULL  ,
	consideration_id     integer    ,
	wants_children       boolean DEFAULT false   ,
	number_of_children   varchar(50)    ,
	will_raise_catholic  boolean DEFAULT false   ,
	likes_children       integer    ,
	children_gravitate   integer    ,
	nurturing            integer    ,
	excited_about_babies integer    ,
	notes                text    ,
	CONSTRAINT children_assessments_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".children_assessments ADD CONSTRAINT children_assessments_children_gravitate_check CHECK ( children_gravitate >= 1) AND (children_gravitate <= 5 );

ALTER TABLE "public".children_assessments ADD CONSTRAINT children_assessments_excited_about_babies_check CHECK ( excited_about_babies >= 1) AND (excited_about_babies <= 5 );

ALTER TABLE "public".children_assessments ADD CONSTRAINT children_assessments_likes_children_check CHECK ( likes_children >= 1) AND (likes_children <= 5 );

ALTER TABLE "public".children_assessments ADD CONSTRAINT children_assessments_nurturing_check CHECK ( nurturing >= 1) AND (nurturing <= 5 );

ALTER TABLE "public".business_assessments ADD CONSTRAINT business_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".character_assessments ADD CONSTRAINT character_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".children_assessments ADD CONSTRAINT children_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".considerations ADD CONSTRAINT fk_considerations_users FOREIGN KEY ( author_email ) REFERENCES "public".users( email );

ALTER TABLE "public".faith_assessments ADD CONSTRAINT faith_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".family_assessments ADD CONSTRAINT family_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".friendship_assessments ADD CONSTRAINT friendship_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".physical_assessments ADD CONSTRAINT physical_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

ALTER TABLE "public".roommate_assessments ADD CONSTRAINT roommate_assessments_consideration_id_fkey FOREIGN KEY ( consideration_id ) REFERENCES "public".considerations( id ) ON DELETE CASCADE;

CREATE TRIGGER update_considerations_timestamp BEFORE UPDATE ON public.considerations FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

