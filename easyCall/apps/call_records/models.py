"""Models for the call_records app."""

from django.db import models

from easyCall.apps.lists.models import ListType


class CallRecord(models.Model):
    list_type = models.ForeignKey(ListType, related_name='records')
    serial_number = models.CharField(max_length=20)

    name_prefix = models.CharField(max_length=20)
    name_first = models.CharField(max_length=255)
    name_middle = models.CharField(max_length=255)
    name_family = models.CharField(max_length=255)
    name_suffix = models.CharField(max_length=60)

    tel_day = models.CharField(max_length=20)
    tel_evening = models.CharField(max_length=20)
    tel_work = models.CharField(max_length=20)
    tel_mobile = models.CharField(max_length=20)

    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255)
    address_3 = models.CharField(max_length=255)
    suburb = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    postcode = models.CharField(max_length=20)
    do_not_mail_reason = models.CharField(max_length=255)

    date_of_birth = models.DateField()
    age = models.CharField(max_length=20)

    NEW = 'nw'
    IN_PROGRESS = 'ip'
    COMPLETE = 'cp'
    STATUS_CHOICES = (
        (NEW, 'New'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETE, 'Completed'),
    )
    status = models.CharField(max_length=2,
                              choices=STATUS_CHOICES,
                              default=NEW)

    def __unicode__(self):
        """CallRecord to_string method."""
        return self.serial_number


class QueueEntry(models.Model):
    list_type = models.ForeignKey(ListType)
    call_record = models.ForeignKey(CallRecord)
    date_added = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        """CallRecord to_string method."""
        return "{} ({})".format(self.call_record.id, self.list_type.slug)