from django import template

register = template.Library()

@register.filter
def lookup(dict, key):
    """returns dict[key]."""
    try:
        return dict[key]
    except:
        return None

@register.filter
def get_item_at_index(collection, index):
    """returns item at index in collection."""
    try:
        if index > (len(collection) - 1):
            return None
        else: 
            return collection[index]
    except:
        return None


@register.filter
def has_items(list: list) -> bool:
    """Returns bool(len(list))."""
    try:
        return bool(len(list))
    except:
        return False
    
@register.filter
def format_float(val) -> str:
    """returns val formatted to 2 decimal place."""
    try:
        return "{0:,.2f}".format(val)
    except:
        return val

@register.filter
def format_string(val) -> str:
    """returns val formatted for display.
    
    val is capitalised,  _ are replaced by -
    """
    try:
        return val.lower().capitalize().replace("_", "-")
    except:
        return val
    

@register.filter
def order_list(l) -> list:
    """returns a sorted version of list l"""
    try:
        return sorted(l)
    except:
        return l
