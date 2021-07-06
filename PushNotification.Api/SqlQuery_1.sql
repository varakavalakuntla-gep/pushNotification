use MyPushNotification;
select * from notifications;

ALTER TABLE notifications
ADD delivered int not null
CONSTRAINT delcon DEFAULT 0
WITH VALUES;

ALTER TABLE notifications
ADD deleted int not null
CONSTRAINT deletecon DEFAULT 0
WITH VALUES;


update dbo.notifications set readyn = 0 where notification_id in (22,24,26)

INSERT INTO trash SELECT * FROM notifications WHERE AddedOn < DATEADD(day, -15, GETDATE());
DELETE FROM notifications WHERE AddedOn < DATEADD(day, -15, GETDATE());
select * from notifications;
select * from trash;

SET IDENTITY_INSERT notifications ON
INSERT INTO notifications (notification_id,title,body,category,AddedOn,readyn,delivered,deleted) SELECT * FROM trash WHERE notification_id is NOT NULL;
DELETE FROM trash WHERE notification_id is NOT NULL;
SET IDENTITY_INSERT notifications OFF

select * from categories;
delete from notifications where category=5;
