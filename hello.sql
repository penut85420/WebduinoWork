drop schema hello;
create schema hello;
use hello;
create table main (
 	id varchar(64),
    data_value int
);
drop table test;
create table test (id varchar(64), data_value datetime);

insert into main (id, data_value) values ('00357035', 6666);

insert into test (id, data_value) values ('B3FFD9D1', '2018-7-17 11:15:14');
select * from test;
ALTER USER 'custom'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
