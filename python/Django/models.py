from __future__ import annotations
from typing import Union
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from email_validator import validate_email
from .model_exceptions import model_exceptions as mdlexc
from .utils import utils as ut


class CustomAccountManager(BaseUserManager):
    """
    A class to represent a custom account manager.

    ...
    
    Inheritance
    -----------
    inherits from django.contrib.auth.models.BaseUserManager


    Methods
    -------
    `create_user(self, email, name, user_name, password, **other_fields)`
        creates and returns a User object.

    `create_superuser(self, email, user_name, name, password, **other_fields)`
        creates and returns a User object that is a superuser of the system
    """

    def create_user(self, email, name, user_name, password, **other_fields):
        if not email:
            raise ValueError(("You must provide an email address"))

        email = self.normalize_email(email)
        user = self.model(
            email=email, name=name, user_name=user_name, password=password, **other_fields) 

        user.save()
        return user

    def create_superuser(self, email, user_name, name, password, **other_fields):
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_active', True)

        return self.create_user(
            email=email, user_name=user_name, name=name, password=password,**other_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    A class used to represent a User of the system

    ...

    Inheritance
    -----------
    Inherits from `AbstractBaseUser` and `PermissionsMixin` which are imported from 
    from django.contrib.auth.models.

    Attributes
    ----------
    name: models.CharField
        the name (full name) of the User

    user_name: models.CharField
        the username of the User

    email: models.CharField
        the email of the    User

    password: models.CharField
        the password of the User

    """

    name = models.CharField(max_length=40, unique=True, null=False, blank=False)
    user_name = models.CharField(max_length=40, unique=True, null=False, blank=False)
    email = models.EmailField(null=False, blank=False, unique=True)
    password = models.CharField(max_length=150, null=False, blank=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    objects = CustomAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name', 'name','password']
    
    def __str__(self):
        return self.name
        
    def save(self, *args, **kwargs):
        validate_email(self.email)
        if not self.pk:
            if not ut.is_password_valid(self.password):
                raise mdlexc.PasswordValueException()
            else:
                self.password = make_password(self.password)
        super(User, self).save(*args, **kwargs)
        