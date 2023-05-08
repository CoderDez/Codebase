"""
This module contains custom Exception classes to be raised in the event
that a Django Model's field doesn't adhere to constraints set in terms of encapsulation.
"""

    
class PasswordValueException(Exception):
    def __str__(self):
        return """Invalid password value. \nPasswords must be between 8 and 20 characters long, contain both an upper and lower case character, and contain a digit."""
    
