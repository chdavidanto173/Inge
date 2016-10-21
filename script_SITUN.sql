CREATE TABLE TP
(
  TP_1 varchar(30), 
  TP_2 varchar(15),
  TP_3 varchar(15),
  TP_4 varchar (15),
  CONSTRAINT pkTP PRIMARY KEY (TP_4)
);



CREATE TABLE TU
(
  TU_1 varchar(15),
  TU_2 varchar(15),
  TU_3 numeric(1),
  CONSTRAINT fkTU FOREIGN KEY (TU_1) REFERENCES TP (TP_4)
);


CREATE TABLE TC(
TC_1 SERIAL,
TC_2 DATE,
TC_3 TEXT,
TC_4 DATE,
TC_5 TEXT,
TC_6 TEXT, 
TC_7 TEXT,
TC_8 TEXT,
TC_9 VARCHAR(15),
TC_10 TEXT,
TC_11 TEXT,
CONSTRAINT pkTC PRIMARY KEY(TC_1),
CONSTRAINT fkTC FOREIGN KEY (TC_9) REFERENCES TP (TP_4)
);



CREATE TABLE TD(
TD_1 INTEGER,
TD_2 INTEGER,
CONSTRAINT fkTD1 FOREIGN KEY (TD_1) REFERENCES TC (TC_1),
CONSTRAINT fkTD2 FOREIGN KEY (TD_2) REFERENCES TC (TC_1),
CONSTRAINT pkTD PRIMARY KEY (TD_1, TD_2)
);


CREATE TABLE TA(
TA_1 INTEGER,
TA_2 DATE,
TA_3 VARCHAR (15),
TA_4 TEXT,
TA_5 NUMERIC(1),
TA_6 INTEGER,
CONSTRAINT fkTA1 FOREIGN KEY (TA_1) REFERENCES TC (TC_1),
CONSTRAINT fkTA3 FOREIGN KEY (TA_3) REFERENCES TP (TP_4),
CONSTRAINT pkTA PRIMARY KEY (TA_1, TA_2)
);


insert into TP values ('Grettel','Castro','Cruz','1');





------------------------FUNCIONES--------------------------
---------------------CREAR POR SEPARADO--------------------

-----------------------------------------------------------
CREATE OR REPLACE FUNCTION post(xn integer) RETURNS void  AS
$BODY$
DECLARE
v_i integer;
BEGIN insert into x (select td_2 from td where td_1=xn );
   FOR v_i IN select td_2 from td,x where td.td_1=x.a loop
       insert into x(select td_2 from td,x where td.td_1=x.a group by td_2,a order by a);
       end loop;  
END $BODY$ LANGUAGE 'plpgsql'

----------------------------------------------------------


CREATE OR REPLACE FUNCTION pre(xn integer) RETURNS void  AS
$BODY$
DECLARE
v_i integer;
BEGIN insert into x (select td_1 from td where td_2=xn );
   FOR v_i IN select td_1 from td,x where td.td_2=x.a loop
      insert into x(select td_1 from td,x where td.td_2=x.a group by a,td_1 order by a);
       end loop; 
END $BODY$ LANGUAGE 'plpgsql'

---------------------------------------------------------

-------------------LLAMADO A FUNCIONES-------------------
CREATE OR REPLACE FUNCTION final(x integer) RETURNS void  AS
$BODY$
DECLARE 
BEGIN
create temp table x(a integer);
perform post(x);
perform  pre(x);      
END $BODY$ LANGUAGE 'plpgsql'
--------------------------------------------------------
CREATE OR REPLACE FUNCTION Borrado() RETURNS void  AS
$BODY$
DECLARE 
BEGIN
drop table x;     
END $BODY$ LANGUAGE 'plpgsql'
--------------------------------------------------------
------------EJECUTAR FUNCION ----------------------------
select final(1)
-----------CONSULTA FINAL -------------------------------
--*******************************************************
select tc_1,tc_2,tc_3,tc_4,tc_5,tc_6,tc_7,tc_8,tc_9,tc_10,tc_11 from tc,x where tc_1=x.a group by tc.tc_1,a order by tc_1;

----------------BOORADO TEMPORAL TABLE------------------------------------
select Borrado();
