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