from django import template

register = template.Library()


@register.filter
def russian_pluralize(number, variants):
    forms = [variant.strip() for variant in variants.split(',')]
    number = abs(int(number))
    if number % 10 == 1 and number % 100 != 11:
        form = forms[0]
    elif 2 <= number % 10 <= 4 and not 12 <= number % 100 <= 14:
        form = forms[1]
    else:
        form = forms[2]
    return form
